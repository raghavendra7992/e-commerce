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
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:
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
    image:[],
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