const jwt = require("jsonwebtoken");

const VerifyUserMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send({ status: false, message: "user is not authorized to perform action. Please login." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res
        .status(403)
        .send({ status: false, message: "user is not authorized to perform action. Please login." });
    }
    req.UserData = data;
    next();
  });
};

module.exports = { VerifyUserMiddleware };