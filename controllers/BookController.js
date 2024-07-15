const BookModel = require("../models/BookModel");
const {BookNameValidator } = require("../validators/BookValidator");

const GetAllBooks = async function (req, res) {
    try {
        const allBooks = await BookModel.find();
        return res.status(200).send({ status: true, message: allBooks });
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const GetBookById = async function (req, res) {
    try {
        const { bookId } = req.params;
        const bookDetail = await BookModel.findById(bookId);
        if (!bookDetail) {
        return res.status(404).send({ status: false, message: `book with given id not found.` });
        }
        return res.status(200).send({ status: true, message: bookDetail });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
        
    }
}

const CreateBook = async function (req, res) {
    try {
        const { bookName, bookCoverImage } = req.body;
        if (!BookNameValidator(bookName)) {
            return res
              .status(400)
              .send({
                status: false,
                message: "book name not present. book's name should be string.",
              });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
        
    }
}

const UpdateBookById = async function (req, res) {
    try {
        let { bookId } = req.params;
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
        
    }
}

const DeleteBookById = async function (req, res) {
    try {
        let { bookId } = req.params;
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message }); 
    }
}

module.exports = { GetAllBooks, GetBookById, CreateBook, UpdateBookById, DeleteBookById };