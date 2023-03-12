const user= require('../model/usermodel.js');
const Product= require('../model/productModdel.js');
const Cart= require('../model/cartmodel.js');
const Coupon=require("../model/coupenmodel.js");
const Order= require("../model/ordermodel.js");

const uniqid=require("uniqid")
const asynchandler=require("express-async-handler");

const { genration } = require('../config/jsonweb.js');
const validateMongoDbId = require('../utilities/valodmongodb.js');
const refreshToken=require("../config/refreshToken.js");
const crypto=require("crypto");
const jwt=require("jsonwebtoken");





const createUser =asynchandler(async(req, res) => {
  const email=req.body.email;
  const findUser=await user.findOne({email:email});
  if(!findUser){
    const newUser= await user.create(req.body);
    res.json(newUser);
  }else{
      throw new Error("User already exists")
  }
  })

const Logincontroller=asynchandler(async (req, res) => {
  const {email,password}=req.body;
  
  const findUser=await user.findOne({email});
  console.log(findUser)
  if(findUser && (await findUser.isPasswordMatched(password))){
    const Token=await refreshToken(findUser?._id);
     const updateuser=await user.findByIdAndUpdate(
      findUser.id,
      {
      Token:Token,
     },
     {new :true}
     );
     res.cookie("Token",Token,{
     httpOnly:true,
     maxAge : 3600000,
     });
        res.json({
    _id:findUser?._id,
    firstname:findUser?.firstname,
    lastname:findUser?.lastname,
    email:findUser?.email,
    mobile:findUser?.mobile,
    token:genration(findUser?._id),
   });
  }else{
    throw new Error("login not working")
  }
});





const getUser=asynchandler(async (req,res) => {
  try {
    const getalluser=await user.find();
    res.json(getalluser);
  } catch (error) {
    throw new Error(error)
  }
})
 // get single user
  const getSingleUser=asynchandler(async (req,res) => {
    const {_id}=req.params
    validateMongoDbId(_id)
        try {
      const getuser=await user.findById(_id);
      res.json(getuser);
    } catch (error) {
      throw new Error(error)
    }
  })
//delete user
const deleteuser=asynchandler(async (req,res) => {
  try {
    const deluser=await user.findByIdAndDelete(req.params.id);
    res.json(deluser);
  } catch (error) {
    throw new Error(error)
  }
})

//update user
const updateUser=asynchandler(async (req,res) => {
  try {
    const {_id}=req.user
    validateMongoDbId(_id);
    const updateuser=await user.findByIdAndUpdate(_id,{firstname:req?.body?.firstname,
    lastname:req?.body?.lastname,
    email:req?.body?.email,
    mobile:req?.body?.mobile},
    {new:true});
    res.json(updateuser);
  } catch (error) {
    throw new Error(error)
  }
})

// block user
const blockuser=asynchandler(async (req,res) => {
  try {
    const {_id}=req.user
    validateMongoDbId(_id)
    const blockuser=await user.findByIdAndUpdate(_id,{blocked:true},
    {new:true});
    res.json(blockuser);
  } catch (error) {
    throw new Error(error)
  }
})

//unblock user;
const unblockuser=asynchandler(async (req,res) => {
  try {
    const {_id}=req.user
    validateMongoDbId(_id)
    const unblockuser=await user.findByIdAndUpdate(_id,{blocked:false},
    {new:true});
    res.json(unblockuser);
  } catch (error) {
    throw new Error(error)
  }
})

//handle refresh token
const handlerefreshtoken=asynchandler(async (req,res) => {
 const cookie=req.cookies;
 if(!cookie?.Token) throw new Error("Nahi chala");
 const Token= cookie.Token;
 jwt.verify(Token,process.env.JWT_SECRET,(err,decoded)=>{
  if(err) throw new Error("invalid token")
  const acessToken=genration(decoded.id);
  res.json({acessToken})
 });
});

//Logout funcnality
const Logoutcontroller=asynchandler(async (req,res) => {
  const cookie=req.cookies;
  if(!cookie?.Token) throw new Error("Nahi chala");
  const Token= cookie.Token;
  const User=await user.findOne({Token});
  if(!User) {
  res.clearCookie("Token",{
    httpOnly:true,
    secure:true,
  });
  res.status(204);
  }
  await user.findByIdAndUpdate(User.id,{Token:""},{new :true});
  res.clearCookie("Token",{
    httpOnly:true,
    secure:true,
  })
  res.json({message:"logout successfull"})
})

//save address
const saveAddress=asynchandler(async (req,res)=>{
  const {_id}=req.user;
  validateMongoDbId(_id);
  try {
    const upadateuser=await user.findByIdAndUpdate(_id,{
      address:req?.body?.address,
    },
    {new:true},);
    res.json(upadateuser)
  } catch (error) {
    throw new Error(error)
  }
})




// update password

const updatepassword=asynchandler(async (req,res) => {
const {_id}=req.user;
const {password}=req.body;
validateMongoDbId(_id);
const User=await user.findById(_id);
if(password){
   User.password=password;
   const updatepass=await User.save();
   res.json(updatepass);
}else{
  res.json(User)
}
})

const forgetpassword=asynchandler(async (req,res) =>{
  const {email}=req.body;
  const findUser=await user.findOne({email})
  if(!findUser) throw new Error("User does not exist")
  try {
    const token=await user.createPasswordResetToken();
    await findUser.save();
    const reseturl=`Hi this link expire after 10 minutes <a href="https://localhost:3000/api/user/reset.password/${token}>Click Here</a>`;
    const data={
      to:email,
      text:"hey user",
      subject:"forget password",
      htm:reseturl,
    }
    sendEmail(data);
    res.json(token)
  } catch (error) {
    throw new Error(error)
  }
})

//reset password
const resetpassword=asynchandler(async (req,res)=>{
  const {password}=req.body;
  const {token}=req.params;
  const hashedtoken=crypto.createhash("sha256").update(token).digest("hex");
  const User = await user.findOne({
    passwordResetToken:hashedtoken,
    passwordResetExpires:{$gt:Date.now() + 10 * 60 * 1000},
  });
  if (!User) 
    throw new Error("Token is invalid or has expired");
    User.password=password;
    User.passwordResetToken=undefined;
    User.passwordResetExpires=undefined;
    await User.save();
    res.json(User);
  

});



// admin login funcanility
const AdminLogincontroller=asynchandler(async (req, res) => {
  const {email,password}=req.body;
  
  const findAdmin=await user.findOne({email});
  if(findAdmin.Role!=="admin") throw new Error(error)

  if(findAdmin && (await findAdmin.isPasswordMatched(password))){
    const Token=await refreshToken(findAdmin?._id);
     const updateuser=await user.findByIdAndUpdate(
      findAdmin.id,
      {
      Token:Token,
     },
     {new :true}
     );
     res.cookie("Token",Token,{
     httpOnly:true,
     maxAge : 3600000,
     });
        res.json({
    _id:findAdmin?._id,
    firstname:findAdmin?.firstname,
    lastname:findAdmin?.lastname,
    email:findAdmin?.email,
    mobile:findAdmin?.mobile,
    token:genration(findAdmin?._id),
   });
  }else{
    throw new Error("login not working")
  }
});

// get whishlist


const getWhishlist=asynchandler(async (req,res)=>{
  const {_id}=req.user;
  try {
    const findUser=await user.findById(_id).populate('wishlist')
    res.json(findUser);
  } catch (error) {
    throw new Error(error)
    
  }
})

//userCart
const userCart=asynchandler(async (req,res)=>{
  const {cart}=req.body;

  const {_id}=req.user;
  validateMongoDbId(_id);
  try {
    let products=[];
    const User=await user.findById(_id);
    const alreadyExistCart=await Cart.findOne({orderby:User._id});
    if (alreadyExistCart){
        alreadyExistCart.remove();

    }
    for(let i=0;i<cart.length;i++){
      let object ={};
      object.product=cart[i]._id;
      object.count=cart[i].count;
      object.color=cart[i].color;
      let getPrice=await Product.findById(cart[i]._id).select("price").exec();
      object.price=getPrice.price;
      products.push(object);

    }
    let cartTotal=0;
    for(let i=0;i<products.length;i++){
      cartTotal=cartTotal+products[i].price * products[i].count;
    }


    let newCart=await new Cart({
      products,
      cartTotal,
      orderby:User?._id,

    }).save()
    res.json(newCart);

  } catch (error) {
    throw new Error(error)
    
  }
});

//get user cart


const getUserCart=asynchandler(async (req,res)=>{
  const {_id}=req.user;
  validateMongoDbId(_id);
  try {
    const cart=await Cart.findOne({orderby:_id}).populate("products.product");
    res.json(cart);

  } catch (error) {
    throw new Error(error)
  }
})


// empty cart


const emptyCart=asynchandler(async (req,res)=>{
  const{_id}=req.user;
  validateMongoDbId(_id);
  try {
    const User=await user.findOne({_id});
    const cart =await Cart.findOneAndRemove({orderby:User._id});
    res.json(cart)
  } catch (error) {
    throw new Error(error)  
  }
})

// applycoupon 

const applycoupon=asynchandler(async(req,res)=>{
const {coupon}=req.body;
const {_id}=req.user;
validateMongoDbId(_id);
const validcoupon=await Coupon.findOne({name:coupon});
if (validcoupon===null){
throw new Error("Invalid Coupon")
}
const User=await user.findOne({_id})

let {products,cartTotal}=await Cart.findOne({orderby:User_id}).populate("products.product");
let totalAfterDiscount=(cartTotal-(cartTotal*validcoupon.discount)/100).toFixed(2);
await Cart.findOneAndUpdate({orderby:User._id},{totalAfterDiscount},{new:true})
res.json(totalAfterDiscount)
})



// create order

const createOrder=asynchandler(async(req,res)=>{
  const {COD,couponApplied}=req.body;
  const {_id}=req.user;
validateMongoDbId(_id);
  try {
    if(!COD) throw new Error("cash order is failed");
  const User=await user.findById(_id);
  let userCart=await Cart.findOne({orderby:User._id});
  let finalAmount=0;
  if(couponApplied&&userCart.totalAfterDiscount){
    finalAmount=userCart.totalAfterDiscount*100;

  }else{
    finalAmount=userCart.cartTotal;
  }
  let newOrder=await new Order({
    products:userCart.products,
    paymentIntent:{
      id:uniqid(),
      method:"COD",
      amount:finalAmount,
      status:"Cash On Delivery",
      Created:Date.now(),
      currency:"usd",
    },
    orderby:User._id,
    orderStatus:"Cash On Delivery",

  }).save()

  let update= userCart.products.map((item)=>{
    return {
      updateOne:{
        filter:{_id:item.product._id},
        update:{$inc:{quantity:  -item.count,sold:+item.count}},
      },
    }
  })
  const updated=await Product.bulkWrite(update,{});
  res.json({message:"success"})

  } catch (error) {
    throw new Error(error);
  }
})

//getorders
const getorders=asynchandler(async (req,res)=>{
  const {_id}=req.user;
validateMongoDbId(_id);

try {
  const userorders=await Order.findOne({oederby:_id}).populate("products.product").exec();
  res.json(userorders)
} catch (error) {
  throw new Error(error)
}

})

// updateorderstatus
 const updateorderstatus=asynchandler(async (req,res)=>{

  const {status}=req.body;
  const {_id}=req.params;
validateMongoDbId(_id);
try {
  const updateorderstatus=await Order.findByIdAndUpdate(_id,
    {
      orderby:status,
      paymentIntent:{
        status:status,
  
      }
    },
  {new:true}
    
    );
    res.json(updateorderstatus)
} catch (error) {
  throw new Error(error)
}
 })





module.exports = {
  updatepassword,
  createUser,
  Logincontroller,
  getUser,
  getSingleUser,
  deleteuser,
  updateUser,
  blockuser,
  unblockuser,
  handlerefreshtoken,
  Logoutcontroller,
  forgetpassword,
  resetpassword,
  AdminLogincontroller,
  getWhishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applycoupon,
  createOrder,
  getorders,
  updateorderstatus


};