// region imports
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
<<<<<<< HEAD
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region config
const jwtSecret = process.env.JWT_SECRET;
// endregion

// region middleware
const auth = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const authHeader = req.header("Authorization");
=======
    const authHeader = req?.header("Authorization");
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!token) {
<<<<<<< HEAD
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "error",
        "Please authenticate"
      );
=======
      return res.status(401).send({ message: "Please authenticate" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    }

    const decoded = jwt.verify(token, jwtSecret);

<<<<<<< HEAD
    const user = await User.findOne({
      _id: decoded._id,
=======
    const user = await User?.findOne({
      _id: decoded?._id,
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
      isDeleted: 0,
      "tokens.token": token,
    });

    if (!user) {
<<<<<<< HEAD
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "error",
        "Please authenticate",
                null,
        "auth middleware"
      );
=======
      return res.status(401).send({ message: "Please authenticate" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
<<<<<<< HEAD
      return sendResponse(
    res,
    err?.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
    "error",
    err?.message || "Something went wrong",
            null,
        "auth middleware"
  );
=======
    res.status(401).send({ message: "Please authenticate" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region exports
module.exports = auth;
// endregion
