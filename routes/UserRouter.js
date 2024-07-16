const express = require("express");
const router = express.Router();
const { VerifyUserMiddleware } = require("../middlewares/VerifyUserMiddleware");
const { RegisterUser, LoginUser, SelectLanguage } = require("../controllers/UserController");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/selectlanguage", VerifyUserMiddleware, SelectLanguage);
module.exports = router; 