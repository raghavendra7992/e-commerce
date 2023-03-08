const Category=require("../model/categeorymodel.js");
const asynchandler=require("express-async-handler");
const validateMongoDbId=require("../utilities/valodmongodb.js");



const createCategory=asynchandler(async(req,res)=>{
    try {
        const category=await Category.create(req.body);
        res.json(category);
    } catch (error) {
        throw new Error(error);
        
    }
})
//update category
const updateCategory=asynchandler(async(req,res)=>{
    try {
        const category=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(category);
    } catch (error) {
        throw new Error(error);
        
    }
})

//delete category
const deleteCategory=asynchandler(async(req,res)=>{
    try {
        const category=await Category.findByIdAndDelete(req.params.id);
        res.json(category);
    } catch (error) {
        throw new Error(error);
        
    }
})
//get category
const getCategory=asynchandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id)
    try {
        const category=await Category.findById(id);
        res.json(category);
    } catch (error) {
        throw new Error(error)
    }


})


//getall categories
const getAllCategories=asynchandler(async(req,res)=>{
    try {
        const categories=await Category.find();
        res.json(categories);
    } catch (error) {
        throw new Error(error);
        
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories
};