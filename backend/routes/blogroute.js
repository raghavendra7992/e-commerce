const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, alreadylikeBlog, Bloguploadimages } = require('../controllers/blogcnt');
const { authmidd, isAdmin } = require('../middleware/authmiddleware');
const { uploadPhoto, blogImageResize } = require('../middleware/uploadimage');
const router=express.Router();

router.post("/",authmidd,isAdmin,createBlog);

router.put('/likes',authmidd,likeBlog);

router.put('/upload/:id',authmidd,isAdmin,uploadPhoto.array('images',2),
blogImageResize,Bloguploadimages)


router.put("/dislikes",authmidd,alreadylikeBlog);


router.put('/:id',authmidd,isAdmin,updateBlog);

router.get('/:id',getBlog)


router.get("/",getAllBlog)

router.delete("/:id",authmidd,isAdmin,deleteBlog)


module.exports =router