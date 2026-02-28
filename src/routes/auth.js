const express=require('express');
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const authRouter=express.Router();
const jwt=require('jsonwebtoken');
const env=require('dotenv');
const { ignore } = require('nodemon/lib/rules/index.js');

authRouter.post("/signup", async (req, res) => {
  const { emailId, password, firstName, lastName } = req.body;
  try {
    const password = req.body.password;
    const passwordhash = await bcrypt.hash(password, 10);
    const user = new User({
      emailId,
      password: passwordhash,
      firstName,
      lastName,
    });
    await user.save();
    res.send("Data send succesfully");
  } catch (err) {
    res.status(400).send("Error sending data" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
      });
      res.send("succesfull");
    } else if (!isPasswordValid) {
      throw new Error("Inavlid Password");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post('/logout',(req,res)=>{
   res.cookie('token',null,{
    expires:new Date(Date.now())
   }).send("logged out")
})

module.exports= authRouter;
   