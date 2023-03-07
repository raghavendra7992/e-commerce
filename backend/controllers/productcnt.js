const Product=require("../model/productModdel.js");
const asynchandler=require('express-async-handler');
const slugify=require('slugify');
const { json } = require("body-parser");



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



module.exports=
{createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct




}






