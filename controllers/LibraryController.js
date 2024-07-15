const LibraryModel = require("../models/LibraryModel");

const GetAllLibraries = async function (req, res) {
    try {
        const allLibraries = await LibraryModel.find();
        return res.status(200).send({ status: true, message: allLibraries });
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const GetLibraryById = async function (req, res) {
    try {
        let { libraryId } = req.params;
         const libraryDetail = await LibraryModel.findById(libraryId);
         if (!libraryDetail) {
           return res.status(404).send({ status: false, message: `library with given id not found.` });
         }
         return res.status(200).send({ status: true, message: libraryDetail });
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const CreateLibrary = async function (req, res) {
    try {
        const { } = req.body;
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const UpdateLibraryById = async function (req, res) {
    try {
        let { libraryId } = req.params;
        
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const DeleteLibraryById = async function (req, res) {
    try {
        let { libraryId } = req.params;
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

module.exports = { GetAllLibraries, GetLibraryById, CreateLibrary, UpdateLibraryById, DeleteLibraryById};