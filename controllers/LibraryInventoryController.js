const LibraryModel = require("../models/LibraryModel");
const BookModel = require("../models/BookModel");

const ListOfBooksInGivenLibrary = async function (req, res) {
    try {
        let { libraryId } = req.params;
        const libraryDetail = await LibraryModel.findById(libraryId);
      if (!libraryDetail) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
            });
          }
          return res.status(404).send({ status: false, message: `library with given id not found.` });
        }
        let listOfBooks = await BookModel.find({ isOwnedBy: libraryId });
        return res.status(200).send({ status: true, message: listOfBooks });

    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const AddBookToGivenLibrary = async function (req,res) {
    try {
        let { libraryId } = req.params;
        const libraryDetail = await LibraryModel.findById(libraryId);
      if (!libraryDetail) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
            });
          }
          return res.status(404).send({ status: false, message: `library with given id not found.` });
        }
        let { bookName } = req.body;
        const bookDetail = await BookModel.findOne({ bookName });
      if (!bookDetail) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
            });
          }
          return res.status(404).send({ status: false, message: `book with given name not found.` });
      }
      await BookModel.findByIdAndUpdate(bookDetail._id,{isOwnedBy:libraryDetail._id})
      return res.status(200).send({ status: true, message: `${bookName} added to ${libraryDetail.libraryName}` });

    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const DeleteBookByIdFromGivenLibrary = async function (req, res) {
    try {
        let { libraryId, bookId } = req.params;
        const libraryDetail = await LibraryModel.findById(libraryId);
      if (!libraryDetail) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
            });
          }
          return res.status(404).send({ status: false, message: `library with given id not found.` });
        }
         const bookDetail = await BookModel.findById(bookId);
      if (!bookDetail) {
           if (req.UserData.lang == "hindi") {
             return res.status(404).send({
               message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
             });
           }
           return res.status(404).send({ status: false, message: `book with given id not found.` });
        }
      if (bookDetail.isOwnedBy != libraryId) {
          if (req.UserData.lang == "hindi") {
            return res.status(404).send({
              message: `${bookId} आईडी वाली पुस्तक लेखक की नहीं है`,
            });
          }
           return res.status(400).send({ status: false, message: `book with given id not found in given library's inventory.` });     
        }
      await BookModel.findByIdAndUpdate(bookDetail._id, { isOwnedBy: null });
        return res.status(200).send({ status: true, message: `${bookDetail.bookName} removed from ${libraryDetail.libraryName}` });

    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}
module.exports = { ListOfBooksInGivenLibrary, AddBookToGivenLibrary, DeleteBookByIdFromGivenLibrary };