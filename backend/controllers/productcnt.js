const Product=require("../model/productModdel.js");
const asynchandler=require('express-async-handler');
const slugify=require('slugify');



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
        const allProducts=await Product.find(req.query);
        res.json(allProducts);
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






