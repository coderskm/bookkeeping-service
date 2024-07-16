const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  bookCoverImage: {
    type: String,
    required: true,
    default: "https://placehold.co/600x400",
  },
  isBorrowed: {
    type: Boolean,
    default: false,
  },
  isBorrowedBy: {
    type: ObjectId,
    ref: "user",
    default:null
  },
  isWrittenBy: {
    type: ObjectId,
    ref: "user",
    required: true,
  },
  isOwnedBy: {
    type: ObjectId,
    ref: "library",
    default:null
  },
});

module.exports = mongoose.model("book", bookSchema);