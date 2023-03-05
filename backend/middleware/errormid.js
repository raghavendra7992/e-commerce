const boTfound=(req,res,next) => {
    const error = new Error(`Not Found:${req.originalUrl}`)
    response.status(404);
    next(error);
}


// errorhandler
const errorhandler =(err, req, res, next) => {
    const statuscode=res.statusCode==200?500:res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack:err?.stack
    });
}

module.exports={
    boTfound,
    errorhandler
}