const mongoose = require("mongoose");
const validator = require("validator");
const env=require('dotenv')
const jwt=require('jsonwebtoken');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate(name) {
        if (!validator.isAlpha(name)) {
          throw new Error("Name format not correct");
        }
      },
    },
    lastName: {
      type: String,
      required: true,
      validate(name) {
        if (!validator.isAlpha(name)) {
          throw new Error("Name format not correct");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Email invalid" + email);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      validation(age) {
        if (age > 150 || age < 10) {
          throw new Error("Age invalid");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Not valid Type");
        }
      },
    },
    photourl: {
      type: String,
      validate(url) {
        if (!validator.isURL(url)) {
          throw new Error("Not valid Url -" + url);
        }
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "You can add a maximum of 10 skills",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT=async function(){
    const user=this;
    const token =await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:'1d'
    }
    );

    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
