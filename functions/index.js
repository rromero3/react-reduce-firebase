'use strict';

// [START import]
const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log('Uppercasing', event.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('uppercase').set(uppercase);
    });

// // [START generateThumbnail]
// /**
//  * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
//  * ImageMagick.
//  */
// // [START generateThumbnailTrigger]
// exports.generateThumbnail = functions.storage.object().onChange(event => {
// // [END generateThumbnailTrigger]
//   // [START eventAttributes]
//   const object = event.data; // The Storage object.

//   const fileBucket = object.bucket; // The Storage bucket that contains the file.
//   const filePath = object.name; // File path in the bucket.
//   const contentType = object.contentType; // File content type.
//   const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
//   const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
//   // [END eventAttributes]

//   // [START stopConditions]
//   // Exit if this is triggered on a file that is not an image.
//   if (!contentType.startsWith('image/')) {
//     console.log('This is not an image.');
//     return;
//   }

//   // Get the file name.
//   const fileName = path.basename(filePath);
//   // Exit if the image is already a thumbnail.
//   if (fileName.startsWith('thumb_')) {
//     console.log('Already a Thumbnail.');
//     return;
//   }

//   // Exit if this is a move or deletion event.
//   if (resourceState === 'not_exists') {
//     console.log('This is a deletion event.');
//     return;
//   }

//   // Exit if file exists but is not new and is only being triggered
//   // because of a metadata change.
//   if (resourceState === 'exists' && metageneration > 1) {
//     console.log('This is a metadata change event.');
//     return;
//   }
//   // [END stopConditions]

//   // [START thumbnailGeneration]
//   // Download file from bucket.
//   const bucket = gcs.bucket(fileBucket);
//   const tempFilePath = path.join(os.tmpdir(), fileName);
//   return bucket.file(filePath).download({
//     destination: tempFilePath
//   }).then(() => {
//     console.log('Image downloaded locally to', tempFilePath);
//     // Generate a thumbnail using ImageMagick.
//     return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
//   }).then(() => {
//     console.log('Thumbnail created at', tempFilePath);
//     // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
//     const thumbFileName = `thumb_${fileName}`;
//     const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
//     const fileMetadata = {
//     	metadata : {
//     		contentType: contentType
//     	}
//     }

//     // Uploading the thumbnail.
//     return bucket.upload(tempFilePath, {destination: thumbFilePath , uploadType:contentType, metadata: fileMetadata});
//   // Once the thumbnail has been uploaded delete the local file to free up disk space.
//   }).then(() => fs.unlinkSync(tempFilePath));
//   // [END thumbnailGeneration]
// });
// // [END generateThumbnail]