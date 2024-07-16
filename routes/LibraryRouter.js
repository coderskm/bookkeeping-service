const express = require("express");
const router = express.Router();
const {
  GetAllLibraries,
  GetLibraryById,
  CreateLibrary,
  UpdateLibraryById,
  DeleteLibraryById,
} = require("../controllers/LibraryController");
const {VerifyUserMiddleware} = require("../middlewares/VerifyUserMiddleware");

router.get("/", VerifyUserMiddleware, GetAllLibraries);
router.get("/:libraryId", VerifyUserMiddleware, GetLibraryById);
router.post("/", VerifyUserMiddleware, CreateLibrary);
router.put("/:libraryId",VerifyUserMiddleware, UpdateLibraryById);
router.delete("/:libraryId", VerifyUserMiddleware, DeleteLibraryById);

module.exports = router;
