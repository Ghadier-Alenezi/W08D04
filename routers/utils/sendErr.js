exports.sendErr = (res, error)=>{
    res.status(401).json({sucess: false, error})
}