const express = require("express");
const router = express.Router();
const { BorrowABook, ReturnBorrowedBook } = require("../controllers/BorrowController");
const { VerifyUserMiddleware } = require("../middlewares/VerifyUserMiddleware");

router.post("/api/borrow", VerifyUserMiddleware, BorrowABook);
router.put("/api/return/:bookId", VerifyUserMiddleware, ReturnBorrowedBook);

module.exports = router;
