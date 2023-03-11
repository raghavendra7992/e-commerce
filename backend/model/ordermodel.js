const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
   products:[
    {
    product:{
        type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
   },
count:Number,
color:String,
    }
],
paymentIntent:{},
orderStatus:{
    type:String,
    default:"Pending",
    enum:["Not Processed","cash on delivery"
   ,"processing",
   "dispatched",
   "Cancelled",
   "Shipped",
   "Delivered"
],
},
orderby:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
},
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('order', orderSchema);