import { getStorage } from "firebase-admin/storage";
import * as admin from "firebase-admin";

// initializeApp({
//   credential: applicationDefault(),
//   storageBucket: "filebase-620a1.appspot.com",
// });

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN as string);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "filebase-620a1.appspot.com",
  });
}

// You can use the bucket references returned by the Admin SDK in conjunction with the official Google Cloud
// Storage client libraries to upload, download, and modify content in the buckets associated with your
// Firebase projects. Note that you do not have to authenticate Google Cloud Storage libraries when using the
// Firebase Admin SDK. The bucket references returned by the Admin SDK are already authenticated with the
// credentials used to initialize your Firebase app

const storage = getStorage();

// 'bucket' is an object defined in the @google-cloud/storage library.
const bucket = storage.bucket();

export default bucket;
