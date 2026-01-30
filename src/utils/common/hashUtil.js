// region package imports
const argon2 = require("argon2");
// endregion


// region hash password utility
const hashPassword = async (password = "") => {

  // ensure password exists to avoid hashing empty string
  if (!password) throw new Error("Password is required");

  // use argon2id because it protects against GPU & side-channel attacks
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
};
// endregion


// region verify password utility
const verifyPassword = async (plainPassword = "", hashedPassword = "") => {

  // guard clauses prevent invalid verification attempts
  if (!plainPassword || !hashedPassword) {
    throw new Error("Both passwords are required for verification");
  }

  return argon2.verify(hashedPassword, plainPassword);
};
// endregion


// region exports
module.exports = {
  hashPassword,
  verifyPassword,
};
// endregion
