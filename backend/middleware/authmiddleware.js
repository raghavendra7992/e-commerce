const User = require("../model/usermodel.js");
const jwt=require("jsonwebtoken");
const asynchandler=require("express-async-handler");


const authmidd=asynchandler(async(req,res,next)=>{
    let token;
    if(req.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
        try {
            if(token){
                const decoded=jwt.verify(token,process.env.JWT_SECRET);
                const user=await User.findById(decoded?.id);
                req.user=user;
                next()
            }
        } catch (error) {
            throw new Error("Not Authorized or Token Expired")
        }

    }else{
        throw new Error("No Token");
    }
})

const isAdmin=asynchandler(async(req,res,next)=>{
    if(req.user?.Role==="admin"){
        next();
    }else{
        throw new Error("Nikal Admin NAHI Hai");
    }


}
)

module.exports={authmidd,isAdmin};