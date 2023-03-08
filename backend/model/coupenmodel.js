const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var coupenSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
        uppercase:true
    },
    expiry:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('coupen', coupenSchema);