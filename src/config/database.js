const mongoose=require('mongoose');

const connectDB=async()=>{mongoose.connect("mongodb+srv://bhavya:5a17XlcOxEv2zNqc@cluster0.1nomnb6.mongodb.net/devTinder")}


module.exports={
    connectDB
}