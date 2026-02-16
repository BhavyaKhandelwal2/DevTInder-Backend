import express from "express";

const app = express();
app.use((req,res)=>{
    res.end("Hello is my name");
})
app.use("/welcome",(req,res)=>{
    res.end("Welcome My Friend")
})
app.listen(65400,()=>{
   console.log("Serve is Running ");
   
})