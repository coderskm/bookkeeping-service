const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
    libraryName: {
        type: String,
        required:true
    },
    
});

module.exports = mongoose.model("library", librarySchema);