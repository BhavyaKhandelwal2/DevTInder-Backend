const express=require('express');
const {userAuth}=require('../middlewares/auth.js')
const requestRouter=express.Router();
const ConnectionRequest=require('../models/connectionRequests.js')
const User=require('../models/user.js');


requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const fromUserId=loggedInUser._id;
        const toUserId=req.params.toUserId
        const status=req.params.status
        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            throw new Error(`Status Not Valid: ${status}`);
        }
        if(fromUserId.toString()===toUserId){
            throw new Error("Cannot send requests to Yourself")
        }
        const toUserExists=User.findById(toUserId);
        if(!toUserExists){
            throw new Error("User didn't Exists");
        }
        const exisitingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(exisitingConnectionRequest){
            return res.status(400).json({message:"Request Already Exists"});
        }

        const newConectionRequest=new ConnectionRequest({
            fromUserId:fromUserId,
            toUserId:toUserId,
            status:status
        })
        const data=await newConectionRequest.save();
        res.json({
            message:"Request sent successfully",
            data:data
        })
    } catch (error) {
        res.send(error.message)
    }
})

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
   try {
      const loggedInUser=req.user;
      const allowedStatus=["accepted","rejected"];
      const{status,requestId}=req.params;
      if(!allowedStatus.includes(status)){
        throw new Error("Status Not Allowed");
      }

      const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"

      })
      if(!connectionRequest){
        return res.status(404).json({
            message:"Connection request not found"
        })
      }
      connectionRequest.status=status;
      const data=await connectionRequest.save();
      res.json({
        message:"Connection request" + status, data:data
      })
   } catch (error) {
       res.send(error.message);
   }
})
module.exports=requestRouter;