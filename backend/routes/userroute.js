const express=require('express');
const{ createUser, Logincontroller, getUser, getSingleUser, deleteuser, updateUser, blockuser, unblockuser, handlerefreshtoken, Logoutcontroller, updatepassword, forgetpassword, resetpassword, AdminLogincontroller, getWhishlist, saveAddress, userCart, getUserCart, emptyCart, applycoupon, createOrder, getorders, updateorderstatus} = require('../controllers/usercnt');
const { authmidd, isAdmin } = require('../middleware/authmiddleware');
const router=express.Router();
router.post("/register",createUser)
router.post("/forget",forgetpassword)
router.post("/reset/:token",resetpassword)
router.post("/login",Logincontroller);
router.post("/admin",AdminLogincontroller)
router.get("/alluser",getUser);
router.get("/whishlist",authmidd,getWhishlist)




router.put("/order/updateorder/:id",authmidd,isAdmin,updateorderstatus)
router.get("/getorders",authmidd,getorders)
router.get("/cart",authmidd,getUserCart)
router.delete("/emptycart",authmidd,emptyCart);
router.get("/refresh",handlerefreshtoken);
router.post("/cart/applycopon",authmidd,applycoupon);
router.post("cart/create",authmidd,createOrder)
router.post("/usercart",userCart);

router.get("/logout",Logoutcontroller)

router.get("/:id",authmidd,isAdmin,getSingleUser);
router.delete("/:id",deleteuser);
router.put("/update",authmidd,updateUser)
router.put("/saveaddress",authmidd,saveAddress)
router.put("/block/:id",authmidd,isAdmin,blockuser)
router.put("/unblock/:id",authmidd,isAdmin,unblockuser);
router.put("/updatepassword",authmidd,updatepassword)

module.exports =router;
