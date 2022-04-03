import { admin, db } from "./admin";

const FBAuth = async (req: any, res: any, next: any) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    req.user = await admin.auth().verifyIdToken(idToken);
    //console.log(req.user);
    const querysnap = await db
      .collection("users")
      .where("userId", "==", req.user.uid)
      .limit(1)
      .get();
    req.user.handle = querysnap.docs[0].get("handle");
    req.user.imageUrl = querysnap.docs[0].get("imageUrl");
    return next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error });
  }
};

export { FBAuth };
