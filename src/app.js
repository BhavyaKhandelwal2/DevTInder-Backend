const express = require("express");
const { connectDB } = require("./config/database.js");
const cookiePareser = require("cookie-parser");
const app = express();
const Auth=require('./middlewares/auth.js')
const authRouter=require('./routes/auth.js');
const profileRouter=require('./routes/profile.js');
const requestRouter=require('./routes/requests.js');
const userRouter=require('./routes/user.js')

app.use(express.json());
app.use(cookiePareser());
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter)

connectDB()
  .then(async () => {
    console.log("Successfully connected");

    app.listen(65400, () => {
      console.log("Server is Running");
    });
  })
  .catch((err) => console.error(err));
