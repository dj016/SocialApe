import { config } from "../util/config";
import { db, admin } from "../util/admin";
import {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails,
} from "../util/validators";
//import firebase = require("firebase");
//const firebase = require("firebase");
import * as firebase from "firebase";
import * as BusBoy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

firebase.initializeApp(config);

const signUp = async (req: any, res: any) => {
  try {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle,
    };
    const { errors, valid } = validateSignUpData(newUser);
    if (!valid) return res.status(400).json(errors);

    const doc = await db.doc(`users/${newUser.handle}`).get();
    if (doc.exists) {
      return res.status(400).json({ handle: "This handle is already taken" });
    } else {
      const data = await firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
      if (data === null || data.user === null) {
        return res
          .status(500)
          .json({ general: "Internal Server Error. Please Try again" });
      } else {
        const token = await data.user.getIdToken();
        const defaultImage = "no-img.png";
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          userId: data.user.uid,
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImage}?alt=media`,
        };
        await db.doc(`users/${newUser.handle}`).set(userCredentials);
        res.status(201).json({ token });
      }
    }
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      res.status(400).json({ email: "email already in use" });
    } else if (error.code === "auth/weak-password") {
      res
        .status(400)
        .json({ password: "password must be atleast 6 characters long " });
    } else {
      res.status(500).json({
        general: "Something Went wrong. Please try again!",
      });
    }
  }
};

const login = async (req: any, res: any) => {
  const userDetials = {
    email: req.body.email,
    password: req.body.password,
  };
  const { errors, valid } = validateLoginData(userDetials);
  if (!valid) return res.status(400).json(errors);

  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(userDetials.email, userDetials.password);
    if (data.user !== null) {
      const token = await data.user.getIdToken();
      res.json({ token });
    } else {
      res
        .status(500)
        .json({ general: "Server internal Error. Please try again" });
    }
    //res.json({ token: user.getIdToken() });
  } catch (error) {
    console.error(error);
    res.status(403).json({ general: "Invalid credentials. Please try again" });
  }
};

const uploadImage = (req: any, res: any) => {
  let imageFileName: any;
  let imageToBeUploaded: any;
  const busboy = new BusBoy({ headers: req.headers });
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong type of file submitted" });
    }
    const imgExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    )}.${imgExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", async () => {
    try {
      await admin
        .storage()
        .bucket(config.storageBucket)
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: { metadata: { contentType: imageToBeUploaded.mimetype } },
        });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
      await db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      res.json({ message: "Image uploaded sucessfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.code });
    }
  });
  busboy.end(req.rawBody);
};

const addUserDetails = async (req: any, res: any) => {
  const userDetails = reduceUserDetails(req.body);
  try {
    await db.doc(`/users/${req.user.handle}`).update(userDetails);
    res.json({ message: "userDetails sucessfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};
// get the own user details for the home page
const getAuthenticatedUser = async (req: any, res: any) => {
  const userData: any = {};
  try {
    const userDoc = await db.doc(`users/${req.user.handle}`).get();
    if (userDoc.exists) {
      userData.credentials = userDoc.data();
      userData.screams = [];
      const qscream = await db
        .collection("screams")
        .where("userHandle", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .get();
      if (!qscream.empty) {
        qscream.docs.forEach((doc) => {
          userData.screams.push({
            body: doc.data().body,
            commentCount: doc.data().commentCount,
            likeCount: doc.data().likeCount,
            createdAt: doc.data().createdAt,
            screamId: doc.id,
          });
        });
      }

      userData.likes = [];
      const likes_query_sanpshot = await db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .get();
      if (!likes_query_sanpshot.empty) {
        likes_query_sanpshot.docs.forEach((doc) => {
          userData.likes.push({ screamId: doc.data().screamId });
        });
      }
      const notifications: any = [];
      const qsnap = await db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .where("read", "==", false)
        .orderBy("createdAt", "desc")
        .get();
      if (!qsnap.empty) {
        qsnap.docs.forEach((doc) => {
          const notifDetails: any = doc.data();
          notifDetails.notificationId = doc.id;
          notifications.push(notifDetails);
        });
      }
      userData.notifications = notifications;
      res.json(userData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};
const markNotificationsRead = async (req: any, res: any) => {
  const batch = db.batch();
  req.body.forEach((notificationId: any) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  try {
    await batch.commit();
    res.json({ message: "Notifications marked read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

const getUserByHandle = async (req: any, res: any) => {
  const userData: any = {};
  try {
    const userDoc: any = await db.doc(`users/${req.params.handle}`).get();
    if (userDoc.exists) {
      userData.credentials = {
        bio: userDoc.data().bio,
        createdAt: userDoc.data().createdAt,
        email: userDoc.data().email,
        handle: userDoc.data().handle,
        imageUrl: userDoc.data().imageUrl,
        location: userDoc.data().location,
      };
      userData.screams = [];
      const qscream = await db
        .collection("screams")
        .where("userHandle", "==", req.params.handle)
        .orderBy("createdAt", "desc")
        .get();
      if (!qscream.empty) {
        qscream.docs.forEach((doc) => {
          userData.screams.push({
            body: doc.data().body,
            commentCount: doc.data().commentCount,
            likeCount: doc.data().likeCount,
            createdAt: doc.data().createdAt,
            screamId: doc.id,
          });
        });
      }
      res.json(userData);
    } else {
      res.status(404).json({ message: "Handle not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

export {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  markNotificationsRead,
  getUserByHandle,
};
