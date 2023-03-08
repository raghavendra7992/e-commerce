const express = require('express');
const { createCoupen, getAllCoupen, singleCoupenById, updateCoupen, deleteCoupen } = require('../controllers/coupencnt');
const { authmidd, isAdmin } = require('../middleware/authmiddleware');
const router=express.Router();

router.post("/",authmidd,isAdmin,createCoupen)
router.get("/",authmidd,isAdmin,getAllCoupen);
router.get("/:id",authmidd,isAdmin,singleCoupenById);
router.put("/:id",authmidd,isAdmin,updateCoupen);
router.delete("/:id",authmidd,isAdmin,deleteCoupen)






module.exports =router;