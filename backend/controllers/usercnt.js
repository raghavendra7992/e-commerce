const user= require('../model/usermodel.js');
const asynchandler=require("express-async-handler");
const { genration } = require('../config/jsonweb.js');




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
  

  const findUser=await user.findOne({email:email});
  if(findUser&&await findUser.isPasswordMatched(password)){
   res.json({
    id:findUser?._id,
    firstname:findUser?.firstname,
    lastname:findUser?.lastname,
    email:findUser?.email,
    mobile:findUser?.mobile,
    token:genration(findUser?._id)
   });
  }else{
    throw new Error("User does not exist")
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
    try {
      const getuser=await user.findById(req.params.id);
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
    const updateuser=await user.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(updateuser);
  } catch (error) {
    throw new Error(error)
  }
})
module.exports = {createUser,Logincontroller,getUser,getSingleUser,deleteuser,updateUser};