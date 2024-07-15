const express = require('express');
const {
  GetAllBooks,
  GetBookById,
  CreateBook,
  UpdateBookById,
  DeleteBookById,
} = require("../controllers/BookController");
const VerifyUserMiddleware = require("../middlewares/VerifyUserMiddleware");
const router = express.Router();

router.get("/", VerifyUserMiddleware, GetAllBooks);
router.get("/:bookId", VerifyUserMiddleware, GetBookById);
router.post("/", VerifyUserMiddleware, CreateBook);
router.put("/:bookId", VerifyUserMiddleware, UpdateBookById);
router.delete("/:bookId", VerifyUserMiddleware, DeleteBookById);
module.exports = { router };