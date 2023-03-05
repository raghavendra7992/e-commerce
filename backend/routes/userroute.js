const express=require('express');
const{ createUser, Logincontroller, getUser, getSingleUser, deleteuser, updateUser} = require('../controllers/usercnt');
const { authmidd, isAdmin } = require('../middleware/authmiddleware');
const router=express.Router();;
router.post("/register",createUser)
router.post("/login",Logincontroller);
router.get("/alluser",getUser);
router.get("/:id",authmidd,isAdmin,getSingleUser);
router.delete("/:id",deleteuser);
router.put("/:id",updateUser)
module.exports =router;
