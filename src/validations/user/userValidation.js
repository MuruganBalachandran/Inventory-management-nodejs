// region imports
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
} = require('../helpers/typeValidations');

const { validationError } = require('../helpers/validationError');
const { VALIDATION_MESSAGES } = require('../../utils/constants/constants');
// endregion



// region validate signup
/**
 * Validates user signup data
 * Fields: Name, Email, Password, Age
 */
const validateSignup = (data = {}) => {
  const errors = [];

  const { Name="", Email="", Password="", Age=0 } = data;

  // region Name
  const nameError = validateName(Name);
  if (nameError) {
    errors.push(nameError);
  }
  // endregion

  // region Email
  const emailError = validateEmail(Email);
  if (emailError) {
    errors.push(emailError);
  }
  // endregion

  // region Password
  const passwordError = validatePassword(Password, { Name, Email });
  if (passwordError) {
    errors.push(passwordError);
  }
  // endregion

  // region Age (optional)
  if (Age !== undefined) {
    const ageError = validateAge(Age);
    if (ageError) {
      errors.push(ageError);
    }
  }
  // endregion
    // region Age (optional)
  if (Age !== undefined) {
    const ageError = validateAge(Age);
    if (ageError) {
      errors.push(ageError);
    }
  }
  // endregion

  // region result
  if (errors.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion



// region validate login
/**
 * Validates user login data
 * Fields: Email, Password
 */
const validateLogin = (data = {}) => {
  const errors = [];

  const { Email, Password } = data;

  // region Email
  const emailError = validateEmail(Email);
  if (emailError) {
    errors.push(emailError);
  }
  // endregion

  // region Password (only presence check through validator)
  const passwordError = validatePassword(Password);
  if (passwordError && passwordError.includes('required')) {
    errors.push(passwordError);
  }
  // endregion

  // region result
  if (errors.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion



// region validate update profile
/**
 * Validates user profile update data
 * Only allows: Name, Password, Age
 */
const validateUpdateProfile = (data = {}) => {
  const allowedUpdates = ['Name', 'Password', 'Age'];
  const updates = Object.keys(data);
  const errors = [];

  // region no fields
  if (updates.length === 0) {
    errors.push(VALIDATION_MESSAGES.NO_FIELDS_FOR_UPDATE);
  }
  // endregion

  // region invalid fields
  const invalidFields = updates.filter((key) => !allowedUpdates.includes(key));
  if (invalidFields.length > 0) {
    errors.push(`${VALIDATION_MESSAGES.INVALID_FIELDS_UPDATE}: ${invalidFields.join(', ')}`);
  }
  // endregion

  const { Name, Password, Age } = data;

  // region Name
  if (Name !== undefined) {
    const nameError = validateName(Name);
    if (nameError) {
      errors.push(nameError);
    }
  }
  // endregion

  // region Password
  if (Password !== undefined) {
    const passwordError = validatePassword(Password, { Name });
    if (passwordError) {
      errors.push(passwordError);
    }
  }
  // endregion

  // region Age
  if (Age !== undefined) {
    const ageError = validateAge(Age);
    if (ageError) {
      errors.push(ageError);
    }
  }
  // endregion

  // region result
  if (errors.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion



// region exports
module.exports = {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
};
// endregion
