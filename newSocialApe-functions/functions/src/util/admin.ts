import * as admin from "firebase-admin";
//import { config } from "./config";
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
//admin.initializeApp(config);
const db = admin.firestore();

export { admin, db };
