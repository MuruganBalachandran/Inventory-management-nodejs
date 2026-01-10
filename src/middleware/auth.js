// region imports
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// endregion

// region config
const jwtSecret = process.env.JWT_SECRET;
// endregion

// region middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req?.header("Authorization");

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      return res.status(401).send({ message: "Please authenticate" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User?.findOne({
      _id: decoded?._id,
      isDeleted: 0,
      "tokens.token": token,
    });

    if (!user) {
      return res.status(401).send({ message: "Please authenticate" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ message: "Please authenticate" });
  }
};
// endregion

// region exports
module.exports = auth;
// endregion
