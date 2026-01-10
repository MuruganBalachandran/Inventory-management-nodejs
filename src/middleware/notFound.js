// region notfound func
const notFound  = (req,res,next)=>{
    res.status(400).send({message:"Route not found"})
}
// endregion

// region exports
module.exports  = notFound;
// endregion