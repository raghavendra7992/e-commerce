const express=require("express");
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addTowhishlist, rating, uploadImages } = require("../controllers/productcnt");
const {isAdmin,authmidd}=require("../middleware/authmiddleware.js");
const { uploadPhoto, productImageResize } = require("../middleware/uploadimage");
const router=express.Router();

router.put('/upload/:id',authmidd,isAdmin,uploadPhoto.array('images',10),
productImageResize,uploadImages)
router.post('/',authmidd,isAdmin,createProduct);

router.get('/:id',getProduct);
router.put("/whishlist",authmidd,addTowhishlist);
router.put("/rating",authmidd,rating)
router.get('/',authmidd,isAdmin,getAllProducts)
router.put('/:id',authmidd,isAdmin,updateProduct);
router.delete('/:id',deleteProduct)
module.exports=router;