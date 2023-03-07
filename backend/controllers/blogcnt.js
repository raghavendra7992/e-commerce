const Blog =require("../model/blogmodel.js");
const User =require("../model/usermodel.js")
const asynchandler=require("express-async-handler");
const validateMongoDbId=require("../utilities/valodmongodb.js");




const createBlog=asynchandler(async(req,res)=>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json()
    } catch (error) {
        
    }



})
module.exports={
    createBlog
}