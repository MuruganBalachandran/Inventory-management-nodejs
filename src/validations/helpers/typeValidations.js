// region package imports
const mongoose = require('mongoose');
// endregion

// region validate ObjectId (for _id, userId, etc.)
const isValidObjectId = (value) => {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value);
};
// endregion

// region name rules
const NAME_REGEX = /^[A-Za-z ]+$/;
const RESERVED_NAMES = ['admin', 'root', 'system', 'null', 'undefined'];
// endregion

// region validate Name
const validateName = (value) => {
  //  REQUIRED CHECK (field must exist)
  if (value === undefined || value === null) {
    return 'Name is required';
  }
  //  STRICT TYPE CHECK (no coercion, no trim before type check)
  if (typeof value !== 'string') {
    return 'Name must be a string';
  }

  //  NORMALIZE AFTER TYPE IS CONFIRMED
  const name = value.trim();

  //  EMPTY CHECK
  if (name.length === 0) {
    return 'Name is required';
  }

  //  RESERVED WORD CHECK (business rule)
  if (RESERVED_NAMES.includes(name.toLowerCase())) {
    return 'Name is reserved, choose another';
  }

  //  PATTERN CHECK
  if (!NAME_REGEX.test(name)) {
    return 'Name can only contain letters and spaces';
  }

  //  LENGTH CHECK (last)
  if (name.length < 3 || name.length > 20) {
    return 'Name must be between 3 and 20 characters';
  }

  return null;
};
// endregion

// region validate Email
const validateEmail = (value) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Email is required';
  }

  //  TYPE
  if (typeof value !== 'string') {
    return 'Email must be a string';
  }

  //  NORMALIZE
  const email = value.trim().toLowerCase();

  //  EMPTY STRING
  if (email.length === 0) {
    return 'Email is required';
  }

  // FORMAT CHECK
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format, must be like (example@example.com)';
  }

  return null;
};
// endregion
// region validate Password
const validatePassword = (value, context = {}) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Password is required';
  }

  //  TYPE
  if (typeof value !== 'string') {
    return 'Password must be a string';
  }

  //  NORMALIZE
  const password = value.trim();

  //  EMPTY STRING
  if (password.length === 0) {
    return 'Password is required';
  }

  //  LENGTH
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  //  COMPLEXITY RULES
  if (!/[a-z]/.test(password))
    return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(password))
    return 'Password must contain an uppercase letter';
  if (!/\d/.test(password)) return 'Password must contain a number';
  if (!/[@$!%*?&]/.test(password))
    return 'Password must contain a special character';

  if (password.toLowerCase().includes('password')) {
    return "Password cannot contain the word 'password'";
  }

  //  CONTEXT CHECKS (SAFE)
  const nameSafe =
    typeof context.Name === 'string' ? context.Name.toLowerCase() : null;

  const emailSafe =
    typeof context.Email === 'string'
      ? context.Email.toLowerCase().split('@')[0]
      : null;

  if (nameSafe && password.toLowerCase().includes(nameSafe)) {
    return 'Password cannot contain Name';
  }

  if (emailSafe && password.toLowerCase().includes(emailSafe)) {
    return 'Password cannot contain Email';
  }

  return null;
};
// endregion

// region validate Age
const validateAge = (value) => {
  //  REQUIRED (only if Age is mandatory in this context)
  if (value === undefined || value === null) {
    return 'Age is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Age must be a valid number';
  }

  //  INTEGER CHECK
  if (!Number.isInteger(value)) {
    return 'Age must be an integer';
  }

  //  RANGE CHECK
  if (value < 0 || value > 120) {
    return 'Age must be between 0 and 120';
  }

  return null;
};
// endregion

// region validate Role
const validateRole = (value) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Role is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'string') {
    return 'Role must be a string';
  }

  //  ALLOWED VALUES
  const allowed = ['user', 'admin'];
  if (!allowed.includes(value)) {
    return 'Invalid role';
  }

  return null;
};
// endregion

// region validate Inventory Name
const validateInventoryName = (value) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Inventory name is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'string') {
    return 'Inventory name must be a string';
  }
  //  TRIM AND LENGTH
  const name = value.trim();
  if (name.length < 3 || name.length > 50) {
    return 'Inventory name must be between 3 and 50 characters';
  }

  return null;
};
// endregion

// region validate Price
const validatePrice = (value) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Price is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Price must be a number';
  }

  //  VALUE CHECK
  if (value < 0) {
    return 'Price must be positive';
  }

  return null;
};
// endregion

// region validate Quantity
const validateQuantity = (value) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Quantity is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Quantity must be a number';
  }

  //  INTEGER CHECK
  if (!Number.isInteger(value)) {
    return 'Quantity must be an integer';
  }

  //  VALUE CHECK
  if (value < 0) {
    return 'Quantity cannot be negative';
  }

  return null;
};
// endregion

// region validate Category
const validateCategory = (value) => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return 'Category is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'string') {
    return 'Category must be a string';
  }

  return null;
};
// endregion

// region validate ObjectId
const validateObjectId = (value) => {
  if (typeof value !== 'string') return 'Id must be string';

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return 'Invalid ObjectId';
  }

  return null;
};
// endregion

// region exports
module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateRole,
  validateObjectId,
  validateInventoryName,
  validatePrice,
  validateQuantity,
  validateCategory,
  isValidObjectId,
};
// endregion
