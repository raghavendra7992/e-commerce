const express=require('express');
const dbconnect = require('./config/db');
const app=express();
const port=3000||process.env.PORT;
const dotenv=require('dotenv').config();
const authRouter=require('./routes/userroute');
dbconnect()
app.use("/",(req,res)=>res.write("my data"))


app.use("/api/user",authRouter)
app.listen(port,()=>{console.log(`listening port ${port}`)});
