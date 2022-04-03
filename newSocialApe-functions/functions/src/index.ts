import * as functions from "firebase-functions";

import {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} from "./handlers/scream";

import {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  markNotificationsRead,
  getUserByHandle,
} from "./handlers/user";

import { FBAuth } from "./util/fbAuth";

import { db } from "./util/admin";

import * as express from "express";
const app = express();
//const app =  require("express")();

// scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.get("/scream/:screamId/delete", FBAuth, deleteScream);

//users route
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserByHandle);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.region("asia-east2").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("asia-east2")
  .firestore.document("likes/{id}")
  .onCreate(async (snapshot: any) => {
    try {
      const screamDoc: any = await db
        .doc(`screams/${snapshot.data().screamId}`)
        .get();
      if (screamDoc.exists) {
        if (screamDoc.data().userHandle === snapshot.data().userHandle) {
          return;
        }
        const screamData: any = screamDoc.data();
        return await db.doc(`notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: screamData.userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          screamId: snapshot.data().screamId,
        });
      } else {
        console.error("The scream Doc doesnot exists");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  });

exports.deleteNotificationOnUnlike = functions
  .region("asia-east2")
  .firestore.document("likes/{id}")
  .onDelete(async (snapshot: any) => {
    try {
      return await db.doc(`notifications/${snapshot.id}`).delete();
    } catch (error) {
      console.error(error);
      return;
    }
  });

exports.createNotificationOnComment = functions
  .region("asia-east2")
  .firestore.document("comments/{id}")
  .onCreate(async (snapshot: any) => {
    try {
      const screamDoc: any = await db
        .doc(`screams/${snapshot.data().screamId}`)
        .get();
      if (screamDoc.exists) {
        if (screamDoc.data().userHandle === snapshot.data().userHandle) {
          return;
        }
        const screamData: any = screamDoc.data();
        return await db.doc(`notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: screamData.userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          screamId: snapshot.data().screamId,
        });
      } else {
        console.error("The scream Doc doesnot exists");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  });

exports.onUserImageChange = functions
  .region("asia-east2")
  .firestore.document("users/{userId}")
  .onUpdate(async (change: any) => {
    if (change.before.data().imageUrl === change.after.data().imageUrl) return;
    console.log("Image changed");
    const batch = db.batch();
    try {
      const allScreams = await db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get();
      allScreams.docs.forEach((doc) => {
        batch.update(db.doc(`screams/${doc.id}`), {
          userImage: change.after.data().imageUrl,
        });
      });
      const allComments = await db
        .collection("comments")
        .where("userHandle", "==", change.before.data().handle)
        .get();
      allComments.docs.forEach((doc) => {
        batch.update(db.doc(`comments/${doc.id}`), {
          userImage: change.after.data().imageUrl,
        });
      });
      return await batch.commit();
    } catch (error) {
      console.error(error);
      return;
    }
  });
