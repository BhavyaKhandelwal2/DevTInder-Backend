const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const env=require('dotenv');

const userAuth = async(req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
      if (!token) {
      return res.status(401).send("No token found. Please login.");
    }

    const decodedmessage = jwt.verify(token, process.env.JWT_SECRET);
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
