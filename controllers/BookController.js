const BookModel = require("../models/BookModel");
const LibraryModel = require("../models/LibraryModel");
const UserModel = require("../models/UserModel");
const { BookNameValidator } = require("../validators/BookValidator");

const GetAllBooks = async function (req, res) {
  try {
    const allBooks = await BookModel.find().select({ bookName: 1 });
    return res.status(200).send({ status: true, message: allBooks });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const GetBookById = async function (req, res) {
  try {
    const { bookId } = req.params;
    const bookDetail = await BookModel.findById(bookId);

    if (!bookDetail) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({ message: "दी गई आईडी वाली किताब नहीं मिली." });
      }
      return res.status(404).send({ status: false, message: `book with given id not found.` });
    }

    const borrowerDetail = await UserModel.findById(bookDetail.isBorrowedBy);
    const libraryDetail = await LibraryModel.findById(bookDetail.isOwnedBy);
    const authorDetail = await UserModel.findById(bookDetail.isWrittenBy);

    const msgObj = {};
    msgObj.bookDetail = {
      bookName: bookDetail.bookName,
      coverImage: bookDetail.bookCoverImage,
    };

    msgObj.authorDetail = { authorName: authorDetail.userName, email: authorDetail.userEmail };

    if (!borrowerDetail) {
      msgObj.borrowerDetail = "not borrowed";
    } else {
      msgObj.borrowerDetail = { borrowerName: borrowerDetail.userName, email: borrowerDetail.userEmail };
    }

    if (!libraryDetail) {
      msgObj.libraryDetail = "not part of any library";
    } else {
      msgObj.libraryDetail = { libraryName: libraryDetail.libraryName };
    }

    return res.status(200).send({ status: true, message: msgObj });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const CreateBook = async function (req, res) {
  try {
    if (req.UserData.type == "author") {
      let { bookName } = req.body;
      let WrittenBy = req.UserData.id;
      if (!BookNameValidator(bookName)) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({ message: "पुस्तक का नाम मौजूद नहीं है. पुस्तक का नाम स्ट्रिंग होना चाहिए." });
        }
        return res.status(400).send({
          status: false,
          message: "book name not present. book's name should be string.",
        });
      }
      const newBook = new BookModel({ bookName, isWrittenBy: WrittenBy });
      await newBook.save();
      return res.status(200).send({ status: true, message: newBook });
    } else {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({ message: "केवल लेखक ही पुस्तक बना सकता है" });
      }
      return res.status(400).send({ status: false, message: "only author can create book." });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const UpdateBookById = async function (req, res) {
  try {
    if (req.UserData.type == "author") {
      let { bookId } = req.params;
      const bookInfo = await BookModel.findById(bookId);
      if (!bookInfo) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({ message: `${bookId} आईडी वाली पुस्तक नहीं मिली` });
        }
        return res.status(404).send({ status: false, message: `book with id ${bookId} not found` });
      }
      if (bookInfo.isWrittenBy != req.UserData.id) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
          });
        }
        return res.status(403).send({ status: false, message: `book with id ${bookId} not belongs to author` });
      }
      let data = req.body;
      const updateObj = {};

      if (data.bookName) {
        if (data.bookName.toLowerCase().trim() === bookInfo.bookName.toLowerCase().trim()) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `अद्यतन नाम मूल नाम के समान है।`,
            });
          }
          return res.status(400).send({ status: false, message: `updated name same as original name.` });
        }
        updateObj.bookName = data.bookName;
      }

      if (data.bookCoverImage) {
        updateObj.bookCoverImage = data.bookCoverImage;
      }

      if (data.isBorrowed === false) {
        updateObj.isBorrowed = false;
        updateObj.isBorrowedBy = null;
      }
      if (data.isBorrowed === true && data.isBorrowedBy !== null) {
        updateObj.isBorrowed = true;
        const borrowerExistsOrNot = await UserModel.findById(data.isBorrowedBy);
        if (!borrowerExistsOrNot) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `उधारकर्ता आईडी मौजूद नहीं है. कृपया सही उधारकर्ता आईडी दर्ज करें।`,
            });
          }
          return res
            .status(400)
            .send({ status: false, message: `borrower id doesn't exist. Please enter correct borrower id.` });
        }
        updateObj.isBorrowedBy = data.isBorrowedBy;
      }

      if (data.isBorrowedBy) {
        if (data.isBorrowedBy === null) {
          updateObj.isBorrowed = false;
          updateObj.isBorrowedBy = null;
        }
        if (data.isBorrowedBy !== null) {
          updateObj.isBorrowed = true;
          const borrowerExistsOrNot = await UserModel.findById(data.isBorrowedBy);
          if (!borrowerExistsOrNot) {
            if (req.UserData.lang == "hindi") {
              return res.status(404).send({
                message: `उधारकर्ता आईडी मौजूद नहीं है. कृपया सही उधारकर्ता आईडी दर्ज करें।`,
              });
            }
            return res
              .status(400)
              .send({ status: false, message: `borrower id doesn't exist. Please enter correct borrower id.` });
          }
          updateObj.isBorrowedBy = data.isBorrowedBy;
        }
      }
      // if (data.isBorrowedBy) {
      //   if (data.isBorrowedBy === null) {
      //     updateObj.isBorrowedBy = data.isBorrowedBy;
      //     updateObj.isBorrowed = false;
      //   }
      //   updateObj.isBorrowedBy = data.isBorrowedBy;
      //   if (!data.isBorrowed) {
      //     updateObj.isBorrowed = data.isBorrowed;
      //   }
      // }

      if (data.isWrittenBy) {
        const authorExistsOrNot = await UserModel.findById(data.isWrittenBy);
        if (!authorExistsOrNot) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `लेखक आईडी मौजूद नहीं है. कृपया सही लेखक आईडी दर्ज करें.`,
            });
          }
          return res
            .status(400)
            .send({ status: false, message: `author id doesn't exist. Please enter correct author id.` });
        }
        if (data.isWrittenBy == bookInfo.isWrittenBy) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `अद्यतन लेखक का नाम मूल लेखक के नाम के समान है।`,
            });
          }
          return res.status(400).send({ status: false, message: `updated author name same as original author name.` });
        }
        updateObj.isWrittenBy = data.isWrittenBy;
      }

      if (data.isOwnedBy) {
        const libraryExistsOrNot = await LibraryModel.findById(data.isOwnedBy);
        if (!libraryExistsOrNot) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `लाइब्रेरी आईडी मौजूद नहीं है. कृपया सही लाइब्रेरी आईडी दर्ज करें.`,
            });
          }
          return res
            .status(400)
            .send({ status: false, message: `library id doesn't exist. Please enter correct library id.` });
        }
        if (data.isOwnedBy == bookInfo.isOwnedBy) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `अद्यतन लाइब्रेरी आईडी मूल लाइब्रेरी आईडी के समान है।`,
            });
          }
          return res.status(400).send({ status: false, message: `updated library id same as original library id.` });
        }
        updateObj.isOwnedBy = data.isOwnedBy;
      }

      let updatedBookData = await BookModel.findByIdAndUpdate(bookId, updateObj, { new: true });
      return res.status(200).send({ status: true, message: updatedBookData });
    } else {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `केवल लेखक ही पुस्तक को अद्यतन कर सकता है।`,
        });
      }
      return res.status(400).send({ status: false, message: "only author can update book." });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const DeleteBookById = async function (req, res) {
  try {
    if (req.UserData.type == "author") {
      let { bookId } = req.params;
      const bookInfo = await BookModel.findById(bookId);
      if (!bookInfo) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${bookId} आईडी वाली पुस्तक नहीं मिली`,
          });
        }
        return res.status(404).send({ status: false, message: `book with id ${bookId} not found` });
      }
      if (bookInfo.isWrittenBy != req.UserData.id) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
          });
        }
        return res.status(403).send({ status: false, message: `book with id ${bookId} not belongs to author` });
      }
      await BookModel.findByIdAndDelete(bookId);
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `${bookId} आईडी वाली पुस्तक हटा दी गई`,
        });
      }
      return res.status(200).send({ status: true, message: `book with id ${bookId} deleted` });
    } else {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `केवल लेखक ही पुस्तक को हटा सकता है।`,
        });
      }
      return res.status(400).send({ status: false, message: "only author can delete book." });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { GetAllBooks, GetBookById, CreateBook, UpdateBookById, DeleteBookById };
