const express = require("express");
const router = express.Router();
const {
  ListOfBooksInGivenLibrary,
  AddBookToGivenLibrary,
  DeleteBookByIdFromGivenLibrary,
} = require("../controllers/LibraryInventoryController");
const { VerifyUserMiddleware } = require("../middlewares/VerifyUserMiddleware");

router.get("/api/libraries/:id/inventory",VerifyUserMiddleware, ListOfBooksInGivenLibrary);
router.post("/api/libraries/:id/inventory",VerifyUserMiddleware, AddBookToGivenLibrary);
router.delete("/api/libraries/:id/inventory/:bookId",VerifyUserMiddleware, DeleteBookByIdFromGivenLibrary);

module.exports = router;
