const express = require('express');
const router = express.Router();
const { VerifyUserMiddleware } = require("../middlewares/VerifyUserMiddleware");
const { UploadBookCoverImage } = require("../controllers/UploadImageController");
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const multer = require("multer");
const { firebaseConfig } = require("../config/FirebaseConfig");

initializeApp(firebaseConfig);

// initialize cloud storage and get a reference to service
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/upload/:bookId", VerifyUserMiddleware, upload.single("imagefilename"), UploadBookCoverImage);

module.exports = router;