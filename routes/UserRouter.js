const express = require("express");
const router = express.Router();

const { RegisterUser, LoginUser } = require("../controllers/UserController");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

module.exports = router; 