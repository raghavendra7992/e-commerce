const Coupen=require("../model/coupenmodel.js");
const validateMongoDbId=require("../utilities/valodmongodb.js");
const asynchandler=require("express-async-handler");

const createCoupen=asynchandler(async(req,res)=>{
    try {
        const newCoupon=await Coupen.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
})

// getallcoupen
const getAllCoupen=asynchandler(async(req,res)=>{
    try {
        const coupen=await Coupen.find();
        res.json(coupen);
    } catch (error) {
        throw new Error(error)
    }
})

// getcoupenbyid
const singleCoupenById=asynchandler(async(req,res)=>{
    try {
        const coupon=await Coupen.findById(req.params.id);
        res.json(coupon);
    } catch (error) {
        throw new Error(error)
    }
})


// updatecoupen
const updateCoupen=asynchandler(async(req,res)=>{
   const {id}=req.params
   validateMongoDbId(id);
   try {
    const updatecoupen=await Coupen.findByIdAndUpdate(id,req.body,{
        new:true
    });
    res.json(updatecoupen);
   } catch (error) {
    throw new Error(error)
   }
})

// deletecoupen
const deleteCoupen=asynchandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDbId(id);
    try {
        const deletecoupen=await Coupen.findByIdAndDelete(id);
        res.json(deletecoupen);
    } catch (error) {
        throw new Error(error)
    }
})




module.exports ={
    createCoupen,
    getAllCoupen,
    singleCoupenById,
    updateCoupen,
    deleteCoupen
}