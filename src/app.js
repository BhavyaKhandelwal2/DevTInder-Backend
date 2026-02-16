import express from "express";

const app = express();
app.use((req,res)=>{
    res.end("Hello is my name");
})
app.listen(65400,()=>{
   console.log("Serve is Running ");
   
})