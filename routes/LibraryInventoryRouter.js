const express = require("express");
const router = express.Router();
const {
  ListOfBooksInGivenLibrary,
  AddBookToGivenLibrary,
  DeleteBookByIdFromGivenLibrary,
} = require("../controllers/LibraryInventoryController");
const { VerifyUserMiddleware } = require("../middlewares/VerifyUserMiddleware");

router.get("/api/libraries/:libraryId/inventory",VerifyUserMiddleware, ListOfBooksInGivenLibrary);
router.post("/api/libraries/:libraryId/inventory", VerifyUserMiddleware, AddBookToGivenLibrary);
router.delete("/api/libraries/:libraryId/inventory/:bookId", VerifyUserMiddleware, DeleteBookByIdFromGivenLibrary);

module.exports = router;
