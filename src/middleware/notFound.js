<<<<<<< HEAD
// region imports
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
// endregion

// region not found middleware
const notFound = (req, res, next) => {
    return sendResponse(
      res, 
      STATUS_CODE.NOT_FOUND, 
      "error", 
      "Route not found",
    null,
  "notFound"
  );
};
// endregion

// region exports
module.exports = notFound;
// endregion
=======
// region notfound func
const notFound  = (req,res,next)=>{
    res.status(400).send({message:"Route not found"})
}
// endregion

// region exports
module.exports  = notFound;
// endregion
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
