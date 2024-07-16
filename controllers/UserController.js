const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  UserNameValidator,
  UserTypeValidator,
  UserEmailValidator,
  UserPasswordValidator
} = require("../validators/UserValidators");


const RegisterUser = async function (req, res) {
  try {
      let { userName, userEmail, userPassword, userType } = req.body;
      let hashedPassword = "";
    if (!UserNameValidator(userName)) {
      return res.status(400).send({ status: false, message: "user name is required which should be string" });
    }
    
      if (!UserEmailValidator(userEmail)) {
          return res
            .status(400)
            .send({
              status: false,
              message: "user email is required which should be string with '@' symbol and correct domain",
            });
      }
      const emailInUse = await UserModel.findOne({ userEmail });
      if (emailInUse) {
          return res.status(400).send({ status: false, message: "email already in use" });
      }
      if (!UserPasswordValidator(userPassword)) {
          return res.status(400).send({ status: false, message: "user password is required which should be string" });
      } else {
          hashedPassword = bcrypt.hashSync(userPassword, 10);
      }
      if (!UserTypeValidator(userType)) {
        return res
          .status(400)
          .send({ status: false, message: "user type is required which should be either 'author' or 'borrower'" });
      }
      const newUser = new UserModel({ userName, userEmail, userPassword: hashedPassword, userType });
      await newUser.save();
    return res.status(201).send({ status: true, message: newUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const LoginUser = async function (req, res) {
    try {
        const { userEmail, userPassword } = req.body;
        if (!UserEmailValidator(userEmail)) {
          return res.status(400).send({ status: false, message: "user email is required which should be string" });
        }
        const validUser = await UserModel.findOne({ userEmail });
        if (!validUser) {
          return res
            .status(404)
            .send({ status: false, message: "email not present, please enter valid email or register yourself to login" });
        }
        if (!UserPasswordValidator(userPassword)) {
          return res.status(400).send({ status: false, message: "user password is required which should be string" });
        } 
        const validPassword = bcrypt.compareSync(userPassword, validUser.userPassword);
        if (!validPassword) {
                    return res
                      .status(401)
                      .send({ status: false, message: "wrong password entered. Please enter correct password." });

        }
        const token = jwt.sign({ id: validUser._id, type: validUser.userType, lang:validUser.language }, process.env.JWT_SECRET);
        const { userPassword: pass, ...rest } = validUser._doc;
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
        
    }
}

const SelectLanguage = async function (req, res) {
  try {
    const { language } = req.body;
    if (language === "hindi") {
      await UserModel.findByIdAndUpdate(req.UserData.id, { language: "hindi" })
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `उपयोगकर्ता द्वारा चुनी गई भाषा हिंदी है`,
        });
      }
      return res.status(200).send({ status: false, message: "language selected by user is hindi" });
    } else if (language === "english") {
      await UserModel.findByIdAndUpdate(req.UserData.id, { language: "english" });
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: `उपयोगकर्ता द्वारा चुनी गई भाषा अंग्रेजी है`,
        });
      }
      return res.status(200).send({ status: false, message: "language selected by user is english" });
    } else {
      if (req.UserData.lang == "hindi") {
        return res.status(404).send({
          message: "चयनित भाषा केवल 'अंग्रेजी' या 'हिन्दी' होनी चाहिए" });
      }
      return res.status(400).send({ status: false, message: "language selected must be 'english' or 'hindi' only" });
      
    }    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
    
  }
}
module.exports = { RegisterUser, LoginUser, SelectLanguage };