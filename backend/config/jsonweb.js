const jwt=require("jsonwebtoken");
const genration=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
}
module.exports={genration};