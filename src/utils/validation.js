
const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","password","skills"];
    const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports={
    validateEditProfileData
}