const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const userAuth = async(req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    const decodedmessage = jwt.verify(token, "bhavya@ganaa210");
    const { _id } = decodedmessage;

    const user=await  User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user=user
    next();
  } catch (err) {
    res.send(err.message);
  }
};

module.exports={
    userAuth
}
