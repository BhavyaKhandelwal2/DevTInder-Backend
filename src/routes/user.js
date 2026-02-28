const ConnectionRequest = require("../models/connectionRequests.js");
const { userAuth } = require("../middlewares/auth.js");
const express = require("express");
const User=require('../models/user.js');

const userRouter = express.Router();

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionrequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    }).populate("fromUserId",["firstName","lastName"])
    .populate("toUserId",["firstName","lastName"]);
    const data=connectionrequest.map((row)=>{
          if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
              return row.toUserId
          }
          return row.fromUserId;
        }
        )
    if (!data) {
      return res.send("No connections found");
    }
    res.json({data:data});
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate('fromUserId',["firstName","lastName"]);
    if (!requests) {
      res.status(400).send("No requests");
    }
    res.json({
      requests: requests,
    });
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.get('/feed',userAuth,async (req,res)=>{
    try {
        const loggedInUser=req.user;
        const pageNo=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit
        const skip=(pageNo-1)*limit
        const connectionrequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        })
        const hideUsersFromFeed=new Set();
        connectionrequests.forEach((req)=>{
            hideUsersFromFeed.add(req.toUserId);
            hideUsersFromFeed.add(req.fromUserId);
        })
        const feed=await User.find({
           $and:[ {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
           ]
        }).select(['firstName','lastName']).skip(skip).limit(limit)
        res.send(feed);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

module.exports = userRouter;
