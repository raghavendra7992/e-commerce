const express=require('express');
const{ createUser, Logincontroller, getUser, getSingleUser, deleteuser, updateUser, blockuser, unblockuser, handlerefreshtoken, Logoutcontroller} = require('../controllers/usercnt');
const { authmidd, isAdmin } = require('../middleware/authmiddleware');
const router=express.Router();
router.post("/register",createUser)
router.post("/login",Logincontroller);
router.get("/alluser",getUser);
router.get("/refresh",handlerefreshtoken);
router.get("/logout",Logoutcontroller)
router.get("/:id",authmidd,isAdmin,getSingleUser);
router.delete("/:id",deleteuser);
router.put("/update",authmidd,updateUser)
router.put("/block/:id",authmidd,isAdmin,blockuser)
router.put("/unblock/:id",authmidd,isAdmin,unblockuser);
module.exports =router;
