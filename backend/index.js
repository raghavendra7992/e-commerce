const bodyParser = require('body-parser');
const express=require('express');
const dbconnect = require('./config/db');
const { boTfound, errorhandler } = require('./middleware/errormid');
const app=express();
const port=3000||process.env.PORT;
const dotenv=require('dotenv').config();
const authRouter=require('./routes/userroute');
dbconnect()
// app.use("/",(req,res)=>res.send("my data"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.use("/api/user",authRouter)

app.use(boTfound);
app.use(errorhandler)




app.listen(port,()=>{console.log(`listening port ${port}`)});
