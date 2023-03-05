const user= require('../model/usermodel.js');
const asynchandler=require("express-async-handler");





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
module.exports = createUser;