const mongoose = require('mongoose');
const validateMongoDbId=(id)=>{
    const isValid=mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("This Id Is Not Valid");
}
module.exports=validateMongoDbId;