const BookModel = require("../models/BookModel");
const UserModel = require("../models/UserModel");

const BorrowABook = async function (req, res) {
    try {
      const { charge, bookId, borrowerId } = req.body;
      const borrowObj = {};
      if (!charge || typeof charge !== "number") {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `चार्ज मनी खाली नहीं होनी चाहिए और संख्या प्रारूप में होनी चाहिए`,
          });
        }
        return res.status(400).send({ status: false, message: "charge money should not be empty and should be in number format" });
      }
      borrowObj.charge = charge;

      const bookInfo = await BookModel.findById(bookId);
      if (!bookInfo) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${bookId} आईडी वाली पुस्तक नहीं मिली`,
          });
        }
        return res.status(400).send({ status: false, message: `book with id ${bookId} not found` });
      }
      await BookModel.findByIdAndUpdate(bookId, { isBorrowed: true });
      borrowObj.bookName = bookInfo.bookName;
      borrowObj.bookId = bookId;

      const borrowerInfo = await UserModel.findById(borrowerId);
      if (!borrowerInfo) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${borrowerId} आईडी वाला उधारकर्ता नहीं मिला`,
          });
        }
        return res.status(400).send({ status: false, message: `borrower with id ${borrowerId} not found` });
      }
      await BookModel.findByIdAndUpdate(bookId, { isBorrowedBy: borrowerInfo._id });
      borrowObj.borrowName = borrowerInfo.userName;
      borrowObj.borrowerId = borrowerId;
      return res.status(200).send({ status: true, message: borrowObj });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });

    }
}

const ReturnBorrowedBook = async function (req, res) {
    try {
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
      if (!bookInfo.isBorrowed) {
        if (req.UserData.lang == "hindi") {
          return res.status(404).send({
            message: `${bookId} आईडी वाली पुस्तक उधार नहीं ली गई थी`,
          });
        }
      return res.status(400).send({ status: false, message: `book with id ${bookId} was not borrowed` });
      }
      await BookModel.findByIdAndUpdate(bookId, { isBorrowed: false, isBorrowedBy: null });
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `किताब वापस कर दी गई है`,
        });
      }
      return res.status(200).send({ status: true, message: "book has been returned" });

    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
        
    }
}
module.exports = { BorrowABook, ReturnBorrowedBook };