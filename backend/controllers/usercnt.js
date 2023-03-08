const user= require('../model/usermodel.js');
const asynchandler=require("express-async-handler");
const { genration } = require('../config/jsonweb.js');
const validateMongoDbId = require('../utilities/valodmongodb.js');
const refreshToken=require("../config/refreshToken.js");
const crypto=require("crypto");
const jwt=require("jsonwebtoken");





const createUser =asynchandler(async(req, res) => {
  const email=req.body.email;
  const findUser=await user.findOne({email:email});
  if(!findUser){
    const newUser= await user.create(req.body);
    res.json(newUser);
  }else{
      throw new Error("User already exists")
  }
  })

const Logincontroller=asynchandler(async (req, res) => {
  const {email,password}=req.body;
  
  const findUser=await user.findOne({email});
  console.log(findUser)
  if(findUser && (await findUser.isPasswordMatched(password))){
    const Token=await refreshToken(findUser?._id);
     const updateuser=await user.findByIdAndUpdate(
      findUser.id,
      {
      Token:Token,
     },
     {new :true}
     );
     res.cookie("Token",Token,{
     httpOnly:true,
     maxAge : 3600000,
     });
        res.json({
    _id:findUser?._id,
    firstname:findUser?.firstname,
    lastname:findUser?.lastname,
    email:findUser?.email,
    mobile:findUser?.mobile,
    token:genration(findUser?._id),
   });
  }else{
    throw new Error("login not working")
  }
});





const getUser=asynchandler(async (req,res) => {
  try {
    const getalluser=await user.find();
    res.json(getalluser);
  } catch (error) {
    throw new Error(error)
  }
})
 // get single user
  const getSingleUser=asynchandler(async (req,res) => {
    const {_id}=req.params
    validateMongoDbId(_id)
        try {
      const getuser=await user.findById(_id);
      res.json(getuser);
    } catch (error) {
      throw new Error(error)
    }
  })
//delete user
const deleteuser=asynchandler(async (req,res) => {
  try {
    const deluser=await user.findByIdAndDelete(req.params.id);
    res.json(deluser);
  } catch (error) {
    throw new Error(error)
  }
})

//update user
const updateUser=asynchandler(async (req,res) => {
  try {
    const {_id}=req.user
    validateMongoDbId(_id);
    const updateuser=await user.findByIdAndUpdate(_id,{firstname:req?.body?.firstname,
    lastname:req?.body?.lastname,
    email:req?.body?.email,
    mobile:req?.body?.mobile},
    {new:true});
    res.json(updateuser);
  } catch (error) {
    throw new Error(error)
  }
})

// block user
const blockuser=asynchandler(async (req,res) => {
  try {
    const {_id}=req.user
    validateMongoDbId(_id)
    const blockuser=await user.findByIdAndUpdate(_id,{blocked:true},
    {new:true});
    res.json(blockuser);
  } catch (error) {
    throw new Error(error)
  }
})

//unblock user;
const unblockuser=asynchandler(async (req,res) => {
  try {
    const {_id}=req.user
    validateMongoDbId(_id)
    const unblockuser=await user.findByIdAndUpdate(_id,{blocked:false},
    {new:true});
    res.json(unblockuser);
  } catch (error) {
    throw new Error(error)
  }
})

//handle refresh token
const handlerefreshtoken=asynchandler(async (req,res) => {
 const cookie=req.cookies;
 if(!cookie?.Token) throw new Error("Nahi chala");
 const Token= cookie.Token;
 jwt.verify(Token,process.env.JWT_SECRET,(err,decoded)=>{
  if(err) throw new Error("invalid token")
  const acessToken=genration(decoded.id);
  res.json({acessToken})
 });
});

//Logout funcnality
const Logoutcontroller=asynchandler(async (req,res) => {
  const cookie=req.cookies;
  if(!cookie?.Token) throw new Error("Nahi chala");
  const Token= cookie.Token;
  const User=await user.findOne({Token});
  if(!User) {
  res.clearCookie("Token",{
    httpOnly:true,
    secure:true,
  });
  res.status(204);
  }
  await user.findByIdAndUpdate(User.id,{Token:""},{new :true});
  res.clearCookie("Token",{
    httpOnly:true,
    secure:true,
  })
  res.json({message:"logout successfull"})
})


// update password

const updatepassword=asynchandler(async (req,res) => {
const {_id}=req.user;
const {password}=req.body;
validateMongoDbId(_id);
const User=await user.findById(_id);
if(password){
   User.password=password;
   const updatepass=await User.save();
   res.json(updatepass);
}else{
  res.json(User)
}
})

const forgetpassword=asynchandler(async (req,res) =>{
  const {email}=req.body;
  const findUser=await user.findOne({email})
  if(!findUser) throw new Error("User does not exist")
  try {
    const token=await user.createPasswordResetToken();
    await findUser.save();
    const reseturl=`Hi this link expire after 10 minutes <a href="https://localhost:3000/api/user/reset.password/${token}>Click Here</a>`;
    const data={
      to:email,
      text:"hey user",
      subject:"forget password",
      htm:reseturl,
    }
    sendEmail(data);
    res.json(token)
  } catch (error) {
    throw new Error(error)
  }
})

//reset password
const resetpassword=asynchandler(async (req,res)=>{
  const {password}=req.body;
  const {token}=req.params;
  const hashedtoken=crypto.createhash("sha256").update(token).digest("hex");
  const User = await user.findOne({
    passwordResetToken:hashedtoken,
    passwordResetExpires:{$gt:Date.now() + 10 * 60 * 1000},
  });
  if (!User) 
    throw new Error("Token is invalid or has expired");
    User.password=password;
    User.passwordResetToken=undefined;
    User.passwordResetExpires=undefined;
    await User.save();
    res.json(User);
  

});


module.exports = {
  updatepassword,
  createUser,
  Logincontroller,
  getUser,
  getSingleUser,
  deleteuser,
  updateUser,
  blockuser,
  unblockuser,
  handlerefreshtoken,
  Logoutcontroller,
  forgetpassword,
  resetpassword

};