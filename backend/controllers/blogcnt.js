const Blog =require("../model/blogmodel.js");
const User = require("../model/usermodel.js")
const asynchandler=require("express-async-handler");
const validateMongoDbId=require("../utilities/valodmongodb.js");
const path=require('path');
const cloudinaryuploadimage = require("../utilities/cloudinary.js");
const fs=require('fs');
//get all blogs



const createBlog=asynchandler(async(req,res)=>{
    
    try {
        const newBlog = await Blog.create(req.body);
        res.json({status:"success",newBlog,});
        
    } catch (error) {
        
    }



})

//update blog
const updateBlog=asynchandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try {
        const updateblog=await Blog.update(id,req.body,{

            new:true,
        });
        res.json({status:"success",updateblog})
    } catch (error) {
        throw new Error(error)
        
    }
})


//get Blog;
const getBlog=asynchandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try {
        const blog=await Blog.findById(id).populate("views");
        const views=await Blog.findByIdAndUpdate(
            id,
            {$inc:{views:1}},
            { new:true}
);

        res.json({status:"success",blog,views})
    } catch (error) {
        throw new Error(error)
        
    }
})

//get all blog posts
const getAllBlog=asynchandler(async(req,res)=>{
    try {
        const blog=await Blog.find();
        res.json({status:"success",blog})
    } catch (error) {
        throw new Error(error)
        
    }
})



//delete blog
const deleteBlog=asynchandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try {
        const deleteblog=await Blog.findByIdAndDelete(id);
        res.json({status:"success",deleteblog})
    } catch (error) {
        throw new Error(error)
        
    }
})



// like blog
const likeBlog=asynchandler(async(req,res)=>{
    const {blogId}=req.body;
    validateMongoDbId(blogId);

    //find the blog  to like






    const blog=await Blog.findById(blogId);
    console.log(blog)


    //find login user
    const loginuserId=req?.User?._id;



    //want to like
    const isLiked=blog?.isLiked



    //disliked
    const isalreadyDisliked=blog?.dislikes?.find(
        (userId)=>userId?.toString()===loginuserId?.toString()
        );

    if(isalreadyDisliked){
        const blog=await Blog.findByIdAndUpdate(blogId,
            {
            $pull:{dislikes:loginuserId},
            isDisliked:false,
        },{new:true});
        res.json(blog)
    
    
    
    
    
    }if(isLiked){
        const blog=await Blog.findByIdAndUpdate(blogId,
            
            {
            $pull:{likes:loginuserId},
            isLiked:false,
        },
        {new:true});
        res.json(blog)
    }

    else{

        const blog=await Blog.findByIdAndUpdate(blogId,
            {
            $push:{likes:loginuserId},
            isliked:false,
        },{new:true});
        res.json(blog)
    }
})






const alreadylikeBlog=asynchandler(async(req,res)=>{
    const {blogId}=req.body;
    validateMongoDbId(blogId);

    //find the blog  to like






    const blog=await Blog.findById(blogId);
    console.log(blog)


    //find login user
    const loginuserId=req?.user?._id;



    //want to like
    const disLiked=blog?.isDisliked



    //disliked
    const isalreadyDisliked=blog?.likes?.find(
        (userId)=>userId?.toString()===loginuserId?.toString()
        );

    if(isalreadyDisliked){
        const blog=await Blog.findByIdAndUpdate(
            blogId,
            {
            $pull:{likes:loginuserId},
            isLiked:false,
        },{new:true});
        res.json(blog)
    
    
    
    
    
    }if(disLiked){
        const blog=await Blog.findByIdAndUpdate(blogId,
            
            {
            $pull:{dislikes:loginuserId},
            isDisliked:false,
        },
        {new:true});
        res.json(blog)
    }

    else{

        const blog=await Blog.findByIdAndUpdate(blogId,
            {
            $push:{dislikes:loginuserId},
            isDisliked:true,
        },{new:true});
        res.json(blog)
    }
})

const Bloguploadimages=asynchandler(async (req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try {
        const uploader=(path)=>cloudinaryuploadimage(path,'images');
        const urls=[];
        const files=req.files;
        for(const file of files){
            const {path}=file;
            const newpath=await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findBlog=await Blog.findByIdAndUpdate(
            id,
            {
                images:urls.map((file)=>{
                    return file
                }),
            },
            {new:true},
        )
    } catch (error) {
        throw new Error(error)
    }
})

module.exports={
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    alreadylikeBlog,
    Bloguploadimages
}