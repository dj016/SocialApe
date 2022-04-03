//const db = require("../util/admin");
import { db } from "../util/admin";

const getAllScreams = async (req: any, res: any) => {
  try {
    const data = await db
      .collection("screams")
      .orderBy("createdAt", "desc")
      .get();
    const screams: FirebaseFirestore.DocumentData[] = [];
    data.forEach((doc: any) => {
      const screamData = doc.data();
      screamData.screamId = doc.id;
      screams.push(screamData);
    });
    return res.json(screams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

const postOneScream = async (req: any, res: any) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }
  try {
    const newScream: any = {
      body: req.body.body,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
      userImage: req.user.imageUrl,
      likeCount: 0,
      commentCount: 0,
    };
    const doc = await db.collection("screams").add(newScream);
    newScream.screamId = doc.id;
    res.status(201).json(newScream);
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
    console.error(error);
  }
};

const getScream = async (req: any, res: any) => {
  try {
    const doc = await db.doc(`/screams/${req.params.screamId}`).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }
    const screamData = doc.data();
    Object.assign(screamData, { screamId: doc.id }, screamData);
    const comments: any = [];
    const comment_query_snapshots = await db
      .collection("/comments")
      .where("screamId", "==", doc.id)
      .orderBy("createdAt", "desc")
      .get();
    comment_query_snapshots.forEach((comment_snapshot) => {
      comments.push(comment_snapshot.data());
    });
    Object.assign(screamData, { comments }, screamData);
    return res.json(screamData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

const commentOnScream = async (req: any, res: any) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Comment body must not be empty" });
  }
  try {
    const doc = await db.doc(`/screams/${req.params.screamId}`).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }
    const data = {
      body: req.body.body,
      screamId: req.params.screamId,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
      userImage: req.user.imageUrl,
    };
    await db.collection(`/comments`).add(data);
    const screamData: any = doc.data();
    screamData.screamId = doc.id;
    screamData.commentCount++;
    await db
      .doc(`/screams/${req.params.screamId}`)
      .update({ commentCount: screamData.commentCount });
    res.json(screamData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

const likeScream = async (req: any, res: any) => {
  try {
    const likeDoc = await db
      .collection("/likes")
      .where("userHandle", "==", req.user.handle)
      .where("screamId", "==", req.params.screamId)
      .get();
    if (!likeDoc.empty)
      return res
        .status(400)
        .json({ message: "You have already liked the scream" });
    const screamDoc = await db.doc(`/screams/${req.params.screamId}`).get();
    const screamData: any = screamDoc.data();
    Object.assign(screamData, { screamId: screamDoc.id }, screamData);
    if (!screamDoc.exists)
      return res.status(404).json({ message: "The scream is not found" });
    await db.collection("likes").add({
      userHandle: req.user.handle,
      screamId: req.params.screamId,
    });
    screamData.likeCount++;
    await db.doc(`/screams/${req.params.screamId}`).update({
      likeCount: screamData.likeCount,
    });
    res.json(screamData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

const unlikeScream = async (req: any, res: any) => {
  try {
    const likeDoc = await db
      .collection("/likes")
      .where("userHandle", "==", req.user.handle)
      .where("screamId", "==", req.params.screamId)
      .get();
    if (likeDoc.empty)
      return res
        .status(400)
        .json({ message: "Scream not liked in the first place" });
    const screamDoc = await db.doc(`/screams/${req.params.screamId}`).get();
    const screamData: any = screamDoc.data();
    Object.assign(screamData, { screamId: screamDoc.id }, screamData);
    await db.doc(`/likes/${likeDoc.docs[0].id}`).delete();
    screamData.likeCount--;
    await db.doc(`/screams/${req.params.screamId}`).update({
      likeCount: screamData.likeCount,
    });
    res.json(screamData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};

const deleteScream = async (req: any, res: any) => {
  try {
    const batch = db.batch();
    const screamDoc = await db.doc(`/screams/${req.params.screamId}`).get();
    if (!screamDoc.exists)
      return res.status(404).json({ message: "scream not found" });
    const screamData: any = screamDoc.data();
    if (screamData.userHandle !== req.user.handle)
      return res.status(403).json({ message: "Not authorized" });
    await db.doc(`/screams/${req.params.screamId}`).delete();
    const allLikes = await db
      .collection("likes")
      .where("screamId", "==", req.params.screamId)
      .get();
    allLikes.docs.forEach((doc) => {
      batch.delete(db.doc(`/likes/${doc.id}`));
    });
    const allComments = await db
      .collection("comments")
      .where("screamId", "==", req.params.screamId)
      .get();
    allComments.docs.forEach((doc) => {
      batch.delete(db.doc(`/comments/${doc.id}`));
    });
    const allNotifications = await db
      .collection("notifications")
      .where("screamId", "==", req.params.screamId)
      .get();
    allNotifications.docs.forEach((doc) => {
      batch.delete(db.doc(`/notifications/${doc.id}`));
    });
    await batch.commit();
    res.json({ message: "Scream Deleted Sucessfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.code });
  }
};
export {
  postOneScream,
  getAllScreams,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
};
