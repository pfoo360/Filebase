# Filebase

![home_page](/screenshots/4.png)
![home_page](/screenshots/7.png)

# About

A small feature of my previous project allowed users to upload pictures. Those images, however, were stored locally within an 'uploads' directory within the project itself and not in the cloud. I was not satisified with that aspect of my project so I decided to create this app to learn about storing images remotely and retrieving those images when needed. Filebase is a simple file hosting app. Users are able to upload files and then download them at a later time.

I also wanted to experiment with NextJS (instead of CRA) and Prisma (instead of writing my own models and SQL queries)

[Click here for a walkthrough.](#walkthrough)

# Features

- NextAuth/OAuth for signups, signins persistent signins and sessions
- Can perform CRUD operations on folders
- Can perform CRD operations on files
- Files are stored in Google's Firebase Storage
- DB and UI are in sync at all times thanks to hooks wrapped around React Query for UX
- Modals!
- Conditionally renders CSS (ex buttons are 'greyed out' when submitting) for better UX
- and much more!

# Technologies

- NextJS
- NextAuth
- Prisma
- PostgreSQL
- Firebase
- Typescript
- React Query
- TailwindCSS

# Goals

- Learn how to store and retrieve files from Firebase
- Learn how to use Firebase's client SDK and Firebase's admin SDK/Google Cloud Storage API
- Familarize myself with NextJS (file-based routing, SSR, etc.)
- Work with TypeScript
- Connect Prisma with a PostgreSQL DB and create schemas to build tables in the DB
- Use Prisma's ORM
- Learn about NextAuth for signins and persist signups in the DB

# Improvements

- Create folder breadcrumbs for better UX
- Thumbnails for user's files instead of just icons
- Possibly better security to absolutely ensure files can only be viewed by their owners
- More error handling (can never go wrong with more error handling of edge cases)
- I should have incorporated TypeScript while developing instead of saving it until the end (would have caught issues while developing and not just at the end of the project + the intellisense would have been much more helpful during the coding and not just at the tailend of the project)
- Media queries and responsive design support (currently it only looks good on certain desktop browsers)
- Small CSS issues that need to be worked on

# Walkthrough

When you first visit the site, you will be prompted to login. Currently, GitHub auth is supported. <br/>
![login](/screenshots/1.png)
<br/>
<br/>

Upon login you will be greeted with the dashboard. As a new user you have yet to create a folder so this is what will be displayed. <br/>
![new_user_home](/screenshots/2.png)
<br/>
<br/>

Clicking on the 'Add Folder' button will prompt a modal popup asking you what to title your soon-to-be created folder. <br/>
![create_folder_modal](/screenshots/3.png)
<br/>
<br/>

After adding a folder (or two) you can click on its name to be taken inside. The blue button next to the folder name will take you up one directory. <br/>
![created_folders](/screenshots/4.png)
![inside_folder](/screenshots/5.png)
<br/>
<br/>

You can create folders inside of folders too. Clicking on the 'Add File' button will prompt another modal popup, which will allow you to upload files. The name of the file and its progress will be displayed while uploads occur. <br/>
![uploading](/screenshots/6.png)
<br/>
<br/>

After uploads have completed, this is what a directory will look like. <br/>
![uploads](/screenshots/7.png)
<br/>
<br/>

Folders can be deleted or renamed by clicking on their red or yellow buttons, respectively. In this instance, we are renaming a folder. <br/>
![rename_modal](/screenshots/11.png)
![rename_modal_disabled](/screenshots/12.png)
![rename_success](/screenshots/13.png)
<br/>
<br/>

Clicking the red trash can button will prompt you to confirm that you wish to delete the file from the app. Like all other aspects of the app, upon confirmation the button(s) will be 'greyed out', indicating an action is taking place (in this case, a file deletion attempt). <br/>
![delete](/screenshots/8.png)
![delete_disabled_buttons](/screenshots/9.png)
<br/>
<br/>

Finally, files can be re-downloaded by clicking on the yellow button next to the delete button. Note, that some files (typically images, videos, and audio files) will open a new tab for you to save while others will be automatically downloaded to your local machine. <br/>
![download](/screenshots/10.png)
<br/>
<br/>

# References

- [Add Firebase Admin SDK to server](https://firebase.google.com/docs/admin/setup#prerequisites)
- [Intro to Firebase Admin Cloud Storage](https://firebase.google.com/docs/storage/admin/start?authuser=0)
- [Google Cloud Storage API reference](https://googleapis.dev/nodejs/storage/latest/File.html)
- [Add Firebase Admin JSON in production](https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5)
- ["The default Firebase app already exists" error fix](https://stackoverflow.com/questions/57763991/initializeapp-when-adding-firebase-to-app-and-to-server)
- [TypeScript with Axios](https://bobbyhadz.com/blog/typescript-http-request-axios)
- [Uploading Multiple Images to Firebase in ReactJS](https://www.youtube.com/watch?v=S4zaZvM8IeI)
- [Prisma crash course](https://www.youtube.com/watch?v=RebA5J-rlwg)
- [Integrating Prisma with NextJS](https://www.youtube.com/watch?v=8DiT-LdYXC0)
- [Make div height occupy parent remaining height](https://stackoverflow.com/questions/11225912/make-div-height-occupy-parent-remaining-height)

Originally I was going to send the file to a backend api and then upload the file from the backend api to Firebase Storage via the Admin SDK. After a few videos and articles I found that might be unnecessary and it would be quicker to upload the image from the frontend to Firebase Storage instead just using the Client SDK (and also due to Vercel limiting the size of requests). The original idea to send the file to the backend and then upload the file from the backend to Firebase is below (although it needs some fine tuning and was originally written in an Express app using Multer):

```

const express = require("express");
const multer = require("multer");
const { initializeApp, cert } = require("firebase-admin/app");
const serviceAccount = require("./firebase-adminsdk.json");
const { getStorage } = require("firebase-admin/storage");
const stream = require("stream");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "xxx.yyy.com",
});

// 'bucket' is an object defined in the @google-cloud/storage library.
const bucket = getStorage().bucket();

app.post("/image", upload.single("image"), (req, res) => {
  const passthroughStream = new stream.PassThrough();
  passthroughStream.write(req.file.buffer);
  passthroughStream.end();

  const file = bucket.file(`${test}`);

  passthroughStream
    .pipe(
      file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
          metadata: {
            custom: "metadata",
            firebaseStorageDownloadTokens: "123",
          },
        },
      })
    )
    .on("error", (error) => {
      console.log("error", error);
    })
    .on("finish", (a) => {
      console.log("finished");
      console.log(a);
      res.send({ msg: "goodbye" });
    });
});


app.get("/image", async (req, res) => {
  //note: save the original filename of photo and always use that to make the request?
  const [file] = await bucket.file("test").download();
  const readStream = new stream.PassThrough();
  readStream.end(file);
  res.set("Content-disposition", "attachment; filename=" + "123");
  readStream.pipe(res);
});
```

- [Uploading buffer to Google Cloud Storage](https://stackoverflow.com/questions/36535153/uploading-a-buffer-to-google-cloud-storage)
- [Firebase Storage tokens information](https://stackoverflow.com/questions/39293781/understanding-firebase-storage-tokens)
- [Generating access token when uploading file via Firebase Admin SDK](https://stackoverflow.com/questions/71610858/can-not-get-url-image-storage-firebase-error-creating-access-token)
- [Generating access token when uploading file via Firebase Admin SDK](https://stackoverflow.com/questions/59432624/how-can-i-generate-access-token-to-file-uploaded-to-firebase-storage)
- [Node ExpressJS Download file from memory/Triggering a file download ](https://stackoverflow.com/questions/45922074/node-express-js-download-file-from-memory-filename-must-be-a-string)
