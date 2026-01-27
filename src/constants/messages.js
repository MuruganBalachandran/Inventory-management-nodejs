/**
 * Centralized error and success messages
 * Prevents message duplication across the application (DRY principle)
 */

// region Auth Messages
const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_ALL_SUCCESS: 'Logged out from all devices',
  REGISTRATION_SUCCESS: 'User registered successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  PLEASE_AUTHENTICATE: 'Please authenticate',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
};
// endregion

// region User Messages
const USER_MESSAGES = {
  PROFILE_FETCHED: 'Profile fetched successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  NO_CHANGES_DETECTED: 'No changes detected',
  ACCOUNT_DELETED: 'Account deleted successfully',
  USER_NOT_FOUND: 'User not found',
};
// endregion

// region Inventory Messages
const INVENTORY_MESSAGES = {
  ITEM_CREATED: 'Inventory item created successfully',
  ITEM_UPDATED: 'Inventory item updated successfully',
  ITEM_DELETED: 'Inventory item deleted successfully',
  ITEMS_FETCHED: 'Items fetched successfully',
  ITEM_NOT_FOUND: 'Inventory item not found',
  NO_RECORDS_FOUND: 'No records found',
  UNAUTHORIZED_ACCESS: 'Not allowed to access this resource',
  NOT_ALLOWED_TO_UPDATE: 'Not allowed to update this inventory item',
};
// endregion

// region Validation Messages
const VALIDATION_MESSAGES = {
  INVALID_INPUT: 'Invalid input provided',
  INVALID_ID: 'Invalid ID',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email format',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  AGE_MUST_BE_NUMBER: 'Age must be a number',
};
// endregion

// region Server Messages
const SERVER_MESSAGES = {
  INTERNAL_ERROR: 'Internal server error',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  REQUEST_FAILED: 'Request failed',
};
// endregion

// region exports
module.exports = {
  AUTH_MESSAGES,
  USER_MESSAGES,
  INVENTORY_MESSAGES,
  VALIDATION_MESSAGES,
  SERVER_MESSAGES,
};
// endregion
