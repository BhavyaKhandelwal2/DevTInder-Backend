const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const cookiePareser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const Auth=require('./middlewares/auth.js')
const {userAuth}=Auth;
app.use(express.json());
app.use(cookiePareser());
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "bhavya@ganaa210");

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
app.get("/profile",userAuth, async (req, res) => {
  try {

    res.send(req.user);
  } catch (error) {
    res.send(error.message);
  }
});



connectDB()
  .then(async () => {
    console.log("Successfully connected");

    app.listen(65400, () => {
      console.log("Server is Running");
    });
  })
  .catch((err) => console.error(err));
