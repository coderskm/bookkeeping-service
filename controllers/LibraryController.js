const LibraryModel = require("../models/LibraryModel");
const BookModel = require("../models/BookModel");

const { LibraryNameValidator } = require("../validators/LibraryValidator");
const GetAllLibraries = async function (req, res) {
  try {
    const allLibraries = await LibraryModel.find();
    return res.status(200).send({ status: true, message: allLibraries });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const GetLibraryById = async function (req, res) {
  try {
    let { libraryId } = req.params;
    const libraryDetail = await LibraryModel.findById(libraryId);
    if (!libraryDetail) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `दी गई आईडी वाली लाइब्रेरी नहीं मिली.`,
        });
      }
      return res.status(404).send({ status: false, message: `library with given id not found.` });
    }
    const booksOwnedByLibrary = await BookModel.find({ isOwnedBy: libraryId }).populate("isBorrowedBy");

    return res.status(200).send({ status: true, message: booksOwnedByLibrary });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const CreateLibrary = async function (req, res) {
  try {
    const { libraryName } = req.body;
    if (!LibraryNameValidator(libraryName)) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `लाइब्रेरी का नाम मौजूद नहीं है. लाइब्रेरी का नाम स्ट्रिंग होना चाहिए.`,
        });
      }
      return res.status(400).send({
        status: false,
        message: "library name not present. library's name should be string.",
      });
    }
    const libraryInfo = await LibraryModel.findOne({ libraryName });
    if (libraryInfo) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `लाइब्रेरी पहले से ही आईडी ${libraryInfo._id} के साथ मौजूद है`,
        });
      }
      return res.status(400).send({
        status: false,
        message: `library already present with id ${libraryInfo._id}`,
      });
    }
    const newLibrary = new LibraryModel({ libraryName });
    await newLibrary.save();
    return res.status(200).send({ status: true, message: newLibrary });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const UpdateLibraryById = async function (req, res) {
  try {
    let { libraryId } = req.params;
    const { libraryName } = req.body;

    const libraryInfo = await LibraryModel.findById(libraryId);
    if (!libraryInfo) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `${libraryId} आईडी वाली लाइब्रेरी नहीं मिली`,
        });
      }
      return res.status(404).send({ status: false, message: `library with id ${libraryId} not found` });
    }
    if (!LibraryNameValidator(libraryName)) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `लाइब्रेरी का नाम मौजूद नहीं है. लाइब्रेरी का नाम स्ट्रिंग होना चाहिए.`,
        });
      }
      return res.status(400).send({
        status: false,
        message: "library name not present. library's name should be string.",
      });
    }
    const libraryAlreadyExists = await LibraryModel.findOne({ libraryName });
    if (libraryAlreadyExists) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `लाइब्रेरी के लिए अद्यतन डेटा पहले से मौजूद है।`,
        });
      }
      return res.status(400).send({
        status: false,
        message: `update data already exists for library.`,
      });
    }
    let updatedLibraryData = await LibraryModel.findByIdAndUpdate(libraryId, { libraryName }, { new: true });
    return res.status(200).send({ status: true, message: updatedLibraryData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const DeleteLibraryById = async function (req, res) {
  try {
    let { libraryId } = req.params;
    const libraryInfo = await LibraryModel.findById(libraryId);
    if (!libraryInfo) {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `${libraryId} आईडी वाली लाइब्रेरी नहीं मिली`,
        });
      }
      return res.status(404).send({ status: false, message: `library with id ${libraryId} not found` });
    }
    const bookDetails = await BookModel.find({ isOwnedBy: libraryId });
    for (let i = 0; i < bookDetails.length; i++){
      await BookModel.findByIdAndUpdate(bookDetails[i]._id, { isOwnedBy: null });
    }
    await LibraryModel.findByIdAndDelete(libraryId);
    if (req.UserData.lang == "hindi") {
      return res.status(404).send({
        message: `${libraryId} आईडी वाली लाइब्रेरी हटा दी गई`,
      });
    }
    return res.status(200).send({ status: true, message: `library with id ${libraryId} deleted` });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { GetAllLibraries, GetLibraryById, CreateLibrary, UpdateLibraryById, DeleteLibraryById };
