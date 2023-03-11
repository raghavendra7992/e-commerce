const Product=require("../model/productModdel.js");
const User =require("../model/usermodel.js")
const asynchandler=require('express-async-handler');
const slugify=require('slugify');
const validateMongoDbId = require("../utilities/valodmongodb");
const cloudinaryUploadImg=require('../utilities/cloudinary.js')
const fs=require('fs')


const createProduct=asynchandler(async(req,res)=>{
try {
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    const newProduct=await Product.create(req.body);
    res.json(newProduct);
} catch (error) {
    throw new Error(error)
}


res.json({
    messsage:"Product Route"
})
})


const getProduct=asynchandler(async(req,res)=>{
    const { id }=req.params;
    try {
        const findProduct=await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

//get all products
const getAllProducts=asynchandler(async(req,res)=>{
   
    try {



        //filtering
        const queryObj={...req.query}
        const excludeFields=['page','sort','limit','fields'];
        excludeFields.forEach(el=>{
            delete queryObj[el]
        })
        let querystr=JSON.stringify(queryObj);
        querystr=querystr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
        


        let query=Product.find(JSON.parse(querystr) );


        //sorting
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(" ");
            query=query.sort(sortBy)
        }else{
            query=query.sort("-createdAt")
        }
       

        //limiting the fields
        if(req.query.fields){
            const fields=req.query.fields.split(',').join(" ");
            query=query.select(fields)

        }else{
            query=query.select("-__v")
        }


        //pagination
        const page=req.query.page;
        const limit=req.query.limit;
        const skip=(page-1)*limit;
        query=query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount=await Product.countDocuments();
            if(skip>=productCount) throw new Error("Page not Exist")
        }        


        const products=await query
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
})

//update products
const updateProduct=asynchandler(async(req,res)=>{
    const { id }=req.params;
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const updateProduct=await Product.findOneAndUpdate(id,req.body,{new:true});
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
})  

//delete product
const deleteProduct=asynchandler(async(req,res)=>{
    const { id }=req.params;
    try {
        const deleteProduct=await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
})
  

//whishlist
const addTowhishlist=asynchandler(async(req,res)=>{
    const {_id}=req.user;
    const {prodId}=req.body;
    try {
        const user= await User.findById(_id);
        const alreadyAdded=user.whishlist.find((id)=>id.toString().toLowerCase===prodId);
        if(alreadyAdded){
            let user=await User.findByIdAndUpdate(_id,{
                $push:{
                    whishlist:prodId
                }
            },
            {new:true});
            res.json(user);
        }else{
            let user=await User.findByIdAndUpdate(_id,{
                $push:{
                    whishlist:prodId
                }
            },
            {new:true});
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
})



//rating
const rating =asynchandler(async (req, res)=>{
const {_id}=req.user
const {star,prodId}=req.body;
try {
    

const product=await product.findById(prodId)
let alreadyrated=product.rating.find((userId)=>userId.postedby.toString()===_id.toString())
if(alreadyrated){
const updateRating=await Product.updateOne(
    {
    ratings:{$eleMatch:alreadyrated},
    },
    {
        $set:{"ratings.s.star":star,"rating.$.comment":comment},
    },
    {new:true,}
);
}else{
    const rateProduct=await Product.findByIdAndUpdate(prodId,{
        $push:{
            star:star,
            postedby:_id,
        }
    },{new:true})

};

const getallrating=await Product.findById(prodId);
let totalRating =getallrating.rating.length;
let ratingsum=getallrating.rating.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0);
let actualRating=Math.round(ratingsum/totalRating);
let finalproduct=await Product.findByIdAndUpdate(prodId,{
    totalRating:actualRating,
},{new:true},)
res.json(finalproduct);
}catch(error){
    throw new Error(error)
}



});



const uploadImages=asynchandler(async (req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    console.log(req.files)
    try {
        const uploader=(path)=>cloudinaryUploadImg(path,"image");
        const urls=[];
        const files=req.files;
        for(const file of files){
            const {path}=file;
            const newpath=await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findProduct=await Product.findByIdAndUpdate(
            id,
            {
                images:urls.map((file)=>{
                    return file;
                }),
            },
            {new:true}
        )
        res.json(findProduct);
    } catch (error) {
        throw new Error(error)
    }

})


module.exports=
{ 
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addTowhishlist,
    rating,
    uploadImages
}






