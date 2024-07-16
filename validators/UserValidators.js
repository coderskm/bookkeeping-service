const validator = require("validator");

const UserNameValidator = function (value) {
  let name = value.trim();
  if (name.length === 0 && typeof name !== "string") return false;
  return true;
};

const UserEmailValidator = function (value) {
  if (!validator.isEmail(value)) return false;
  return true;
};

const UserPasswordValidator = function (value) {
    if (value.length === 0 && typeof type !== "string") return false;
    return true;
}

const UserTypeValidator = function (value) {
  let type = value.toLowerCase().trim();
  let userTypeArray = ["author", "borrower"];
  if (type.length === 0 && typeof type !== "string" && !userTypeArray.includes(type)) return false;
  return true;
};

const UserLangValidator = function (value) {
  let type = value.toLowerCase().trim();
  let userLangArray = ["english", "hindi"];
  if (type.length === 0 && typeof type !== "string" && !userLangArray.includes(type)) return false;
  return true;
}

module.exports = { UserNameValidator, UserTypeValidator, UserEmailValidator, UserPasswordValidator, UserLangValidator };
