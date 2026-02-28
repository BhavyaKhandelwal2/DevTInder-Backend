const express=require('express');
const {userAuth}=require('../middlewares/auth.js')
const profileRouter=express.Router();
const {validateEditProfileData}=require('../utils/validation.js')
profileRouter.get("/profile/view",userAuth, async (req, res) => {
  try {

    res.send(req.user);
  } catch (error) {
    res.send(error.message);
  }
});

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
  if(!validateEditProfileData(req)){
    throw new Error("This cannot be Updated");
  }
  const loggedInUser=req.user;
  Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key])
  await loggedInUser.save()
  res.json({message:`${loggedInUser.firstName}, your profile updated sucessfully`,
    data:loggedInUser}
  );
})
profileRouter.patch('/profile/forgotpassword',userAuth,async(req,res)=>{
  const user=req.user;
  const newPassword=req.body.password;
  user.password=newPassword
  await user.save();
  res.send("Password Updated succesfully");
})

module.exports=profileRouter;