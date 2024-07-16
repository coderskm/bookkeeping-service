const { initializeApp } = require("firebase/app");
const { getDownloadURL, getStorage, ref, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");
const { firebaseConfig } = require("../config/FirebaseConfig");
const BookModel = require("../models/BookModel");
// initialize firebase aplication
initializeApp(firebaseConfig);

// initialize cloud storage and get a reference to service
const storage = getStorage();

// setting up multer as middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

const UploadBookCoverImage = async function (req, res) {
  try {
    if (req.UserData.type == "author") {
      const { bookId } = req.params;
      const bookData = await BookModel.findById(bookId);
      if (!bookData) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${bookId} आईडी वाली पुस्तक नहीं मिली।`,
          });
        }
        return res.status(404).send({ status: false, message: `book with id ${bookId} not found.` });
      }
      if (req.UserData.id != bookData.isWrittenBy) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `उपयोगकर्ता पुस्तक की कवर छवि अपलोड करने के लिए अधिकृत नहीं है।`,
          });
        }
        return res.status(403).send({ status: false, message: `User not authorized to upload book's cover image.` });
      }
      const storageRef = ref(storage, `files/${req.file.originalname + "  " + Date.now()}`);

      // create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // upload file in bucket storage
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

      // grab public URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        await BookModel.findByIdAndUpdate(bookId, { bookCoverImage : downloadURL});
      const fileObj = {
        name: req.file.originalname,
        type: req.file.mimetype,
        imageUrl:downloadURL,
      };
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `पुस्तक कवर छवि फायरबेस पर अपलोड की गई`,
          fileDetail: fileObj,
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "book cover image uploaded to firebase", fileDetail: fileObj });
    } else {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `केवल लेखक ही पुस्तक कवर छवि अपलोड कर सकता है`,
        });
      }
      return res.status(400).send({ status: false, message: `only author can upload book cover image ` });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { UploadBookCoverImage };
