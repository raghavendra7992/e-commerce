const multer=require("multer")
const sharp=require("sharp");
const path=require("path");
const multerstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
cb(null,path.join(__dirname,"../public/images"));
    },
    filename:(req,file,cb)=>{
        const uniquesufix=Date.now()+'-'+Math.round(Math.random()*1e9);
        cb(null,file.filename+"-"+uniquesufix+".jpg");
    }
});



const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startWith('image')){

        cb(null,true);;

    }else{
        cb({
            message:"unsupported File"
        },
        false
        );
    }
}


const uploadphoto=multer({
    storage:multerstorage,
    fileFilter:multerFilter,
    limits:{
        fileSize:2000000
    },
})



const productImgresize=async((req,res,next)=>{

})





module.exports={
    uploadphoto,
    productImgresize
}