const bodyParser = require('body-parser');
const express=require('express');
const dbconnect = require('./config/db');
const { boTfound, errorhandler } = require('./middleware/errormid');
const app=express();
const port=3000||process.env.PORT;
const dotenv=require('dotenv').config();
const authRouter=require('./routes/userroute');
const productRouter=require('./routes/productroutes.js');
const blogRouter=require('./routes/blogroute.js');
const categoryRouter=require('./routes/categoryroutes.js');
const blogCategoryRouter=require('./routes/blogrcategoryoute.js');
const brandRouter=require('./routes/brandroutes.js');
const coupenRouter=require('./routes/coupenrote.js');
const cookieParser=require("cookie-parser");
const morgan = require('morgan');
dbconnect()



app.use(morgan('dev'));
// app.use("/",(req,res)=>res.send("my data"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter)
app.use("/api/blog",blogRouter);
app.use("/api/category",categoryRouter);
app.use("/api/blogcategory",blogCategoryRouter);
app.use("/api/brand",brandRouter);
app.use("api/coupen",coupenRouter);




app.use(boTfound);
app.use(errorhandler)




app.listen(port,()=>{console.log(`listening port ${port}`)});
