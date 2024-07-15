const LibraryModel = require("../models/LibraryModel");

const ListOfBooksInGivenLibrary = async function (req, res) {
    try {
        
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const AddBookToGivenLibrary = async function (req,res) {
    try {
        
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const DeleteBookByIdFromGivenLibrary = async function (req, res) {
    try {
        
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}
module.exports = { ListOfBooksInGivenLibrary, AddBookToGivenLibrary, DeleteBookByIdFromGivenLibrary };