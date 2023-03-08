const express = require('express');
const { updateCategory, deleteCategory, getCategory, getAllCategories, createCategory } = require('../controllers/categeorycnt');
const { authmidd, isAdmin } = require('../middleware/authmiddleware');
const router=express.Router();


router.post('/',authmidd,isAdmin,createCategory);
router.put('/:id',authmidd,isAdmin,updateCategory);
router.delete('/:id',authmidd,isAdmin,deleteCategory);
router.get('/:id',authmidd,isAdmin,getCategory);
router.get('/',authmidd,isAdmin,getAllCategories)








module.exports=router