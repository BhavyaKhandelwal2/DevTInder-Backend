const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  const {emailId,password,firstName,lastName}=req.body;
  try {
   const password= req.body.password;
   const passwordhash=await bcrypt.hash(password,10);
   const user = new User({
    emailId,
    password:passwordhash,
    firstName,
    lastName}
   );
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
    if(isPasswordValid){
        res.send("Invalid credentials");

    }
    else if(!isPasswordValid){
        throw new Error("Inavlid Password");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Something Went Wrong ," + error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const id = req.body._id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(400).send("UserId inavlid");
    } else {
      res.send("User deleted Succesfully");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.emailId;
    const users = await User.find({ emailId: email });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Something went Wrong" + err.message);
  }
});

app.patch("/user", async (req, res) => {
  try {
    const { _id, ...data } = req.body;

    const ALLOWED_UPDATES = ["about", "skills"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Update Not Allowed");
    }

    const user = await User.findByIdAndUpdate(_id, data, {
      runValidators: true,
      new: true,
    });

    if (!user) {
      throw new Error("Update not allowed");
    }

    res.send("Updated Successfully");
  } catch (error) {
    res.status(400).send(error.message);
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
