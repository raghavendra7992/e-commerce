const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
   category:{
        type:String,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isliked:{
        type:Boolean,
        default:false,
    },
    isdislikes:
    {type:Boolean,
        default:false,
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    dislikes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    image:{
        type:string,
        default:"https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    author:{
        type:String,
        default:"admin",
    },
},{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true
});

//Export the model
module.exports = mongoose.model('blog', blogSchema);