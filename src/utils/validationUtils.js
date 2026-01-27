// region package imports
const mongoose = require('mongoose');
// endregion

// region validate object id utility
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
// endregion

// region validate non empty string utility
const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};
// endregion

// region validate email utility
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};
// endregion

// region validate password utility
const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[@$!%*?&]/.test(password)) return false;
  if (password.toLowerCase().includes('password')) return false;
  return true;
};
// endregion

// region validate age utility
const isValidAge = (age) => {
  return (
    typeof age === 'number' &&
    Number.isInteger(age) &&
    age >= 0 &&
    age <= 120
  );
};
// endregion

// region validate positive integer utility
const isPositiveInteger = (value) => {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0
  );
};
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
