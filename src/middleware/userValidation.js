// region imports
const sendResponse = require("../utils/sendResponse");
const STATUS_CODE = require("../constants/statusCodes");
const {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  isValidAge,
} = require("../utils/validationUtils");
// endregion

// region Signup validation
const signupValidation = (req, res, next) => {
  const { name, email, password, age,role } = req.body;
// name field
  if (!isNonEmptyString(name)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name is required",
      null,
      "Signup validation"
    );
  }

    if (name.length < 3 || name.length > 20) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name must be 3–20 characters",
            null,
      "Signup validation"
    );
  }

// email field
  if (!isNonEmptyString(email)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Email is required",
            null,
      "Signup validation"
    );
  }

    if (!isValidEmail(email)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Invalid email",
            null,
      "Signup validation"
    );
  }

  // password field
  if (!isNonEmptyString(password)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Password is required",
            null,
      "Signup validation"
    );
  }

  if (!isValidPassword(password)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Password must be 8+ chars, with uppercase, lowercase, number, special char, and not contain 'password'",
            null,
      "Signup validation"
    );
  }

  // age field
  if (age !== undefined && !isValidAge(age)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Invalid age :  age must be positive",
            null,
      "Signup validation"
    );
  }

  next();
};
// endregion

// region Login validation
const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

// email
  if (!isNonEmptyString(email)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Email is required",
            null,
      "login validation"
    );
  }

    if (!isValidEmail(email)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Invalid email",
               null,
      "login validation"
    );
  }

// password
  if (!isNonEmptyString(password)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Password is required",
               null,
      "login validation"
    );
  }



  next();
};
// region update profile validation
const updateProfileValidation = (req, res, next) => {
  const allowedUpdates = ["name", "password", "age"];
  
  const updates = Object.keys(req.body);
// updated field check
  if (updates.length === 0) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "No fields provided for update",
               null,
      "update profile validation"
    );
  }
// check invalid field 
  const invalidFields = updates.filter(key => !allowedUpdates.includes(key));
  if (invalidFields.length) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      `You cannot update the field(s): ${invalidFields.join(", ")}`,
          null,
      "update profile validation"
    );
  }

  const { name, password, age } = req.body;
  
// name
  if (name !== undefined && !isNonEmptyString(name)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name is required",
          null,
      "update profile validation"
    );
  }

  if (name !== undefined && (name.length < 3 || name.length > 20)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Name must be 3–20 characters",
          null,
      "update profile validation"
    );
  }
// password
  if (password !== undefined && !isNonEmptyString(password)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Password is required",
          null,
      "update profile validation"
    );
  }

  if (password !== undefined && !isValidPassword(password)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Password must be 8+ chars, with uppercase, lowercase, number, special char, and not contain 'password'",
          null,
      "update profile validation"
    );
  }
// age
  if (age !== undefined && !isValidAge(age)) {
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "error",
      "Invalid age",
          null,
      "update profile validation"
    );
  }

  next();
};
// endregion

// region exports
module.exports = {
  signupValidation,
  loginValidation,
  updateProfileValidation,
};
// endregion
