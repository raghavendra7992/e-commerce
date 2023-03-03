const user= require('../model/usermodel.js');






const createUser =async(req, res) => {
const email=req.body.email;
const findUser=await user.findOne(email);
if(!findUser){
  const newUser=user.create(req.body);
  res.json(newUser);
}else{
    res.json({msg:"User Account Created Please Login"});
    success:false;
}
}
module.exports = createUser;