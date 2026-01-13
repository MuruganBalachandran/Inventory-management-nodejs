// region imports
const mongoose = require("mongoose");
// endregion

// region validate function
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// region isNonEmptyString
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;
// endregion

// region isValidEmail
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
// endregion


// region valid password
const isValidPassword = (password) => {
  if (typeof password !== "string") return false;
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[@$!%*?&]/.test(password)) return false;
  if (password.toLowerCase().includes("password")) return false;
  return true;
};
// endregion

// region valid age
const isValidAge = (age) =>
  typeof age === "number" && Number.isInteger(age) && age >= 0 && age <= 120;
// endregion

// region positive integer
const isPositiveInteger = (value) =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;
// endregion

// region exports
module.exports = {
  isValidObjectId,
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  isValidAge,
  isPositiveInteger,
};
// endregion