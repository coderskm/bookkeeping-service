const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  userPassword: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["author", "borrower"],
  },
  language: {
    type: String,
    required:true,
    enum: ["english", "hindi"],
    default:"english"
  },
});

module.exports = mongoose.model("user", userSchema);