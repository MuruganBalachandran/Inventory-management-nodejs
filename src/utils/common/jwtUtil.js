// region package imports
const jwt = require("jsonwebtoken");
// endregion

// region environment config
const { env } = require("../../config/env/envConfig");
const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRY = "7d";
// endregion


// region generate token utility
const generateToken = (userId = "") => {

  // prevent generating token without user id
  if (!userId) throw new Error("User ID required for token generation");

  return jwt.sign(
    { _id: userId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      algorithm: "HS256", // explicitly define algorithm
    }
  );
};
// endregion


// region verify token utility
const verifyToken = (token = "") => {

  // ensure token exists
  if (!token) throw new Error("Token required");

  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });
};
// endregion


// region exports
module.exports = {
  generateToken,
  verifyToken,
};
// endregion
