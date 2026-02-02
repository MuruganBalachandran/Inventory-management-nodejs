// region imports
const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region name rules
const NAME_REGEX = /^(?=.*[\p{L}\p{M}])[\p{L}\p{M}\d\s'-]+$/u; // Support Unicode letters & numbers, but at least one letter required
const RESERVED_NAMES = [
  'admin', 'root', 'system', 'null', 'undefined', 'administrator',
  'superuser', 'moderator', 'owner', 'support', 'help', 'service',
  'bot', 'api', 'test', 'demo', 'guest', 'anonymous', 'user',
  'default', 'public', 'private', 'internal', 'external'
];
// endregion

// region validate Name
/**
 * Advanced validation for Person/User names.
 * Enforces string type, length, reserved words, and character patterns.
 */
const validateName = (value = "") => {
  // FALSY VALUE CHECK - catch all falsy values explicitly
  if (value === undefined || value === null || value === '' || value === false || value === 0) {
    return VALIDATION_MESSAGES?.NAME_REQUIRED ?? 'Name is required';
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.NAME_STRING ?? 'Name must be a string';
  }

  // NORMALIZE AFTER TYPE IS CONFIRMED
  const name = value?.trim?.() ?? "";

  // EMPTY STRING CHECK after trimming
  if (name?.length === 0) {
    return VALIDATION_MESSAGES?.NAME_EMPTY ?? 'Name cannot be empty';
  }

  // RESERVED WORD CHECK (business rule)
  if (RESERVED_NAMES?.includes?.(name?.toLowerCase?.())) {
    return VALIDATION_MESSAGES?.NAME_RESERVED ?? 'This name is reserved';
  }

  // EXCESSIVE SPACES CHECK
  if (/\s{2,}/.test(name)) {
    return VALIDATION_MESSAGES?.NAME_SPACES ?? 'Name cannot contain multiple consecutive spaces';
  }

  // LEADING/TRAILING SPECIAL CHARS CHECK
  if (/^[-']|[-']$/.test(name)) {
    return VALIDATION_MESSAGES?.NAME_SPECIAL_START ?? 'Name cannot start or end with special characters';
  }

  // PATTERN CHECK - allow international characters
  if (!NAME_REGEX.test(name)) {
    return VALIDATION_MESSAGES?.NAME_PATTERN ?? 'Name contains invalid characters';
  }

  // MINIMUM WORD LENGTH CHECK
  const words = name?.split?.(/\s+/) ?? [];
  if (words?.some?.(w => (w?.length ?? 0) < 1)) {
    return VALIDATION_MESSAGES?.NAME_WORD_LENGTH ?? 'Each part of the name must be at least 2 characters';
  }

  // LENGTH CHECK (last)
  if (name?.length < 3 || name?.length > 50) {
    return VALIDATION_MESSAGES?.NAME_LENGTH_INVALID ?? 'Name must be 3–50 characters';
  }

  return null;
};
// endregion

// region email rules
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'mailinator.com', 'trashmail.com',
  'temp-mail.org', 'fakeinbox.com', 'sharklasers.com'
];

const COMMON_DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'outlok.com': 'outlook.com'
};
// endregion

// region validate Email
/**
 * Comprehensive email validation.
 * Checks format, domain typos, and disposable email providers.
 */
const validateEmail = (value = "") => {
  // FALSY VALUE CHECK - catch all falsy values explicitly
  if (value === undefined || value === null || value === '' || value === false || value === 0) {
    return VALIDATION_MESSAGES?.EMAIL_REQUIRED ?? 'Email is required';
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.EMAIL_STRING ?? 'Email must be a string';
  }

  // NORMALIZE
  const email = value?.trim?.()?.toLowerCase?.() ?? "";

  // EMPTY STRING CHECK after trimming
  if (email?.length === 0) {
    return VALIDATION_MESSAGES?.EMAIL_EMPTY ?? 'Email cannot be empty';
  }

  // MAX LENGTH CHECK (RFC 5321)
  if (email?.length > 254) {
    return VALIDATION_MESSAGES?.EMAIL_LONG ?? 'Email is too long';
  }

  // FORMAT CHECK - more comprehensive regex
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES?.EMAIL_FORMAT ?? 'Invalid email format';
  }

  // EXTRACT DOMAIN
  const domain = email?.split?.('@')?.[1] ?? "";
  
  // DISPOSABLE EMAIL CHECK
  if (DISPOSABLE_DOMAINS?.includes?.(domain)) {
    return VALIDATION_MESSAGES?.EMAIL_DISPOSABLE ?? 'Disposable email addresses are not allowed';
  }

  // COMMON TYPO CHECK
  if (COMMON_DOMAIN_TYPOS?.[domain]) {
    const suggestedEmail = `${email?.split?.('@')?.[0] ?? ""}@${COMMON_DOMAIN_TYPOS[domain]}`;
    return (VALIDATION_MESSAGES?.EMAIL_TYPO_SUGGESTION ?? 'Did you mean {email}?')?.replace?.('{email}', suggestedEmail) ?? 'Check for domain typos';
  }

  return null;
};
// endregion

// region password rules
const COMMON_PASSWORDS = [
  'password', 'password123', '12345678', 'qwerty', 'abc123',
  'monkey', 'letmein', 'trustno1', 'dragon', 'baseball',
  'iloveyou', 'master', 'sunshine', 'ashley', 'bailey',
  'passw0rd', 'shadow', 'superman', 'qazwsx', 'michael',
  'football', 'welcome', 'jesus', 'ninja', 'mustang',
  'password1', 'admin', 'admin123', 'root', 'toor'
];
// endregion

// region validate Password
/**
 * Robust password strength validation.
 * Enforces length, character types (upper/lower/num/spec), and context-aware checks.
 */
const validatePassword = (value = "", context = {}) => {
  // FALSY VALUE CHECK - catch all falsy values explicitly
  if (value === undefined || value === null || value === '' || value === false || value === 0) {
    return VALIDATION_MESSAGES?.PASSWORD_REQUIRED ?? 'Password is required';
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.PASSWORD_STRING ?? 'Password must be a string';
  }

  // DO NOT TRIM PASSWORD - preserve intentional spaces
  const password = value ?? "";

  // EMPTY STRING CHECK
  if (password?.length === 0) {
    return VALIDATION_MESSAGES?.PASSWORD_EMPTY ?? 'Password cannot be empty';
  }

  // LENGTH CHECKS
  if (password?.length < 8) {
    return VALIDATION_MESSAGES?.PASSWORD_MIN_LENGTH ?? 'Password must be at least 8 characters';
  }

  if (password?.length > 128) {
    return VALIDATION_MESSAGES?.PASSWORD_MAX_LENGTH ?? 'Password is too long';
  }

  // COMPLEXITY RULES - require all character types
  if (!/[a-z]/.test(password)) {
    return VALIDATION_MESSAGES?.PASSWORD_LOWERCASE ?? 'Password must contain a lowercase letter';
  }
  
  if (!/[A-Z]/.test(password)) {
    return VALIDATION_MESSAGES?.PASSWORD_UPPERCASE ?? 'Password must contain an uppercase letter';
  }
  
  if (!/\d/.test(password)) {
    return VALIDATION_MESSAGES?.PASSWORD_NUMBER ?? 'Password must contain a number';
  }
  
  if (!/[@$!%*?&#^()_+=\-\[\]{}|\\:;"'<>,.\/]/.test(password)) {
    return VALIDATION_MESSAGES?.PASSWORD_SPECIAL ?? 'Password must contain a special character';
  }

  // COMMON PASSWORD CHECK
  const passwordLower = password?.toLowerCase?.() ?? "";
  for (const common of COMMON_PASSWORDS) {
    if (passwordLower?.includes?.(common)) {
      return VALIDATION_MESSAGES?.PASSWORD_COMMON ?? 'This password is too common';
    }
  }

  // REPEATED CHARACTERS CHECK
  if (/(.)\1{2,}/.test(password)) {
    return VALIDATION_MESSAGES?.PASSWORD_REPEAT ?? 'Password cannot contain repeated characters';
  }

  // SEQUENTIAL CHARACTERS CHECK
  const sequences = ['012', '123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def'];
  for (const seq of sequences) {
    if (passwordLower?.includes?.(seq)) {
      return VALIDATION_MESSAGES?.PASSWORD_SEQUENCE ?? 'Password cannot contain sequential characters';
    }
  }

  // CONTEXT CHECKS (SAFE) - prevent password containing user info
  const nameSafe = typeof context?.Name === 'string' ? context?.Name?.toLowerCase?.()?.trim?.() ?? "" : null;
  const emailSafe = typeof context?.Email === 'string' ? context?.Email?.toLowerCase?.()?.split?.('@')?.[0] ?? "" : null;

  if (nameSafe && nameSafe?.length >= 3 && passwordLower?.includes?.(nameSafe)) {
    return VALIDATION_MESSAGES?.PASSWORD_NAME_CONTAIN ?? 'Password cannot contain your name';
  }

  if (emailSafe && emailSafe?.length >= 3 && passwordLower?.includes?.(emailSafe)) {
    return VALIDATION_MESSAGES?.PASSWORD_EMAIL_CONTAIN ?? 'Password cannot contain your email username';
  }

  return null;
};
// endregion

// region validate Age
/**
 * Validates user age.
 * Enforces integer type, realistic range (10-120), and finite status.
 */
const validateAge = (value) => {
  // FALSY VALUE CHECK - but allow 0 as valid age
  if (value === undefined || value === null || value === '' || value === false) {
    return VALIDATION_MESSAGES?.AGE_REQUIRED ?? 'Age is required';
  }

  // STRICT TYPE CHECK - prevent type coercion from strings
  if (typeof value !== 'number') {
    return VALIDATION_MESSAGES?.AGE_STRING ?? 'Age must be a number';
  }

  // NaN CHECK
  if (Number?.isNaN?.(value)) {
    return VALIDATION_MESSAGES?.AGE_VALID ?? 'Age must be a valid number';
  }

  // INFINITY CHECK
  if (!Number?.isFinite?.(value)) {
    return VALIDATION_MESSAGES?.AGE_FINITE ?? 'Age must be a finite number';
  }

  // INTEGER CHECK
  if (!Number?.isInteger?.(value)) {
    return VALIDATION_MESSAGES?.AGE_WHOLE ?? 'Age must be a whole number';
  }

  // MINIMUM AGE CHECK (COPPA compliance - 13 years)
  if (value < 10) {
    return VALIDATION_MESSAGES?.AGE_MIN ?? 'You must be at least 10 years old';
  }

  // MAXIMUM AGE CHECK (realistic limit)
  if (value > 120) {
    return VALIDATION_MESSAGES?.AGE_MAX ?? 'Please enter a valid age';
  }

  return null;
};
// endregion

// region validate Role
/**
 * Restricts roles to allowed system values ('user', 'admin').
 */
const validateRole = (value = "user") => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return VALIDATION_MESSAGES?.ROLE_REQUIRED ?? 'Role is required';
  }

  //  TYPE CHECK
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.ROLE_STRING ?? 'Role must be a string';
  }

  //  ALLOWED VALUES
  const allowed = ['user', 'admin'];
  if (!allowed?.includes?.(value)) {
    return VALIDATION_MESSAGES?.ROLE_INVALID ?? 'Invalid role';
  }

  return null;
};
// endregion

// region validate Inventory Name
/**
 * Basic validation for inventory product names.
 */
const validateInventoryName = (value = "") => {
  // FALSY VALUE CHECK - catch all falsy values explicitly
  if (value === undefined || value === null || value === '' || value === false || value === 0) {
    return VALIDATION_MESSAGES?.INVENTORY_NAME_REQUIRED ?? 'Inventory name is required';
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.INVENTORY_NAME_STRING ?? 'Inventory name must be a string';
  }

  // NORMALIZE
  const name = value?.trim?.() ?? "";

  // EMPTY STRING CHECK after trimming
  if (name?.length === 0) {
    return VALIDATION_MESSAGES?.INVENTORY_NAME_EMPTY ?? 'Inventory name cannot be empty';
  }

  // LENGTH CHECK
  if (name?.length < 3 || name?.length > 100) {
    return VALIDATION_MESSAGES?.NAME_LENGTH_INVENTORY ?? 'Inventory name must be 3–100 characters';
  }

  // ALPHANUMERIC REQUIREMENT - must contain at least one letter or number
  if (!/[a-zA-Z0-9]/.test(name)) {
    return VALIDATION_MESSAGES?.INVENTORY_NAME_PATTERN ?? 'Inventory name must be alphanumeric';
  }

  // EXCESSIVE SPECIAL CHARACTERS CHECK
  const specialCharCount = (name?.match?.(/[^a-zA-Z0-9\s]/g) || [])?.length ?? 0;
  if (specialCharCount > name?.length * 0.3) {
    return VALIDATION_MESSAGES?.INVENTORY_NAME_SPECIAL ?? 'Inventory name contains too many special characters';
  }

  // EXCESSIVE SPACES CHECK
  if (/\s{2,}/.test(name)) {
    return VALIDATION_MESSAGES?.INVENTORY_NAME_SPACES ?? 'Inventory name cannot contain multiple spaces';
  }

  return null;
};
// endregion

// region validate Price
/**
 * Validates product prices.
 * Enforces decimal precision (max 2 places) and non-negative logic.
 */
const validatePrice = (value) => {
  // FALSY VALUE CHECK - but allow 0 as valid price (free items)
  if (value === undefined || value === null || value === '' || value === false) {
    return VALIDATION_MESSAGES?.PRICE_REQUIRED ?? 'Price is required';
  }

  // STRICT TYPE CHECK - prevent type coercion from strings
  if (typeof value !== 'number') {
    return VALIDATION_MESSAGES?.PRICE_STRING ?? 'Price must be a number';
  }

  // NaN CHECK
  if (Number?.isNaN?.(value)) {
    return VALIDATION_MESSAGES?.PRICE_VALID ?? 'Price must be a valid number';
  }

  // INFINITY CHECK
  if (!Number?.isFinite?.(value)) {
    return VALIDATION_MESSAGES?.PRICE_FINITE ?? 'Price must be a finite number';
  }

  // NEGATIVE CHECK
  if (value < 0) {
    return VALIDATION_MESSAGES?.PRICE_NEGATIVE ?? 'Price cannot be negative';
  }

  // MINIMUM PRICE CHECK (at least 0.01 if not free)
  if (value > 0 && value < 0.01) {
    return VALIDATION_MESSAGES?.PRICE_MIN ?? 'Price must be at least 0.01';
  }

  // MAXIMUM PRICE CHECK (prevent overflow or typos)
  if (value > 99999999.99) {
    return VALIDATION_MESSAGES?.PRICE_MAX ?? 'Price is too high';
  }

  // DECIMAL PRECISION CHECK (max 2 decimal places)
  if (!Number?.isInteger?.(value * 100)) {
    return VALIDATION_MESSAGES?.PRICE_DECIMAL ?? 'Price can have at most 2 decimal places';
  }

  return null;
};
// endregion

// region validate Quantity
/**
 * Validates inventory stock counts.
 * Enforces whole numbers and non-negative counts.
 */
const validateQuantity = (value) => {
  // FALSY VALUE CHECK - but allow 0 as valid quantity (out of stock)
  if (value === undefined || value === null || value === '' || value === false) {
    return VALIDATION_MESSAGES?.QUANTITY_REQUIRED ?? 'Quantity is required';
  }

  // STRICT TYPE CHECK - prevent type coercion from strings
  if (typeof value !== 'number') {
    return VALIDATION_MESSAGES?.QUANTITY_STRING ?? 'Quantity must be a number';
  }

  // NaN CHECK
  if (Number?.isNaN?.(value)) {
    return VALIDATION_MESSAGES?.QUANTITY_VALID ?? 'Quantity must be a valid number';
  }

  // INFINITY CHECK
  if (!Number?.isFinite?.(value)) {
    return VALIDATION_MESSAGES?.QUANTITY_FINITE ?? 'Quantity must be a finite number';
  }

  // INTEGER CHECK
  if (!Number?.isInteger?.(value)) {
    return VALIDATION_MESSAGES?.QUANTITY_WHOLE ?? 'Quantity must be a whole number';
  }

  // NEGATIVE CHECK
  if (value < 0) {
    return VALIDATION_MESSAGES?.QUANTITY_NEGATIVE ?? 'Quantity cannot be negative';
  }

  // MAXIMUM QUANTITY CHECK (realistic limit)
  if (value > 10000000) {
    return VALIDATION_MESSAGES?.QUANTITY_MAX ?? 'Quantity is too high';
  }

  return null;
};
// endregion

// region category rules
const ALLOWED_CATEGORIES = [
  'electronics', 'clothing', 'food', 'furniture',
  'books', 'toys', 'sports', 'automotive',
  'health', 'beauty', 'home', 'garden',
  'office', 'pet', 'baby', 'others'
];
// endregion

// region validate Category
/**
 * Enforces strict category assignment for inventory items.
 */
const validateCategory = (value = "") => {
  // FALSY VALUE CHECK - catch all falsy values explicitly
  if (value === undefined || value === null || value === '' || value === false || value === 0) {
    return VALIDATION_MESSAGES?.CATEGORY_REQUIRED ?? 'Category is required';
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.CATEGORY_STRING ?? 'Category must be a string';
  }

  // NORMALIZE
  const category = value?.trim?.()?.toLowerCase?.() ?? "";

  // EMPTY STRING CHECK after trimming
  if (category?.length === 0) {
    return VALIDATION_MESSAGES?.CATEGORY_EMPTY ?? 'Category cannot be empty';
  }

  // ENUM VALIDATION - enforce allowed categories
  if (!ALLOWED_CATEGORIES?.includes?.(category)) {
    return (VALIDATION_MESSAGES?.CATEGORY_INVALID ?? 'Invalid category') + `. Allowed categories are: ${ALLOWED_CATEGORIES?.join?.(', ') || 'none'}`;
  }

  return null;
};
// endregion

// region validate ObjectId
/**
 * Validates MongoDB ObjectId strings.
 */
const validateObjectId = (value = "") => {
  // FALSY VALUE CHECK - catch all falsy values explicitly
  if (value === undefined || value === null || value === '' || value === false || value === 0) {
    return VALIDATION_MESSAGES?.ID_REQUIRED ?? 'ID is required';
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== 'string') {
    return VALIDATION_MESSAGES?.ID_STRING ?? 'ID must be a string';
  }

  // TRIM
  const id = value?.trim?.() ?? "";

  // EMPTY STRING CHECK
  if (id?.length === 0) {
    return VALIDATION_MESSAGES?.ID_EMPTY ?? 'ID cannot be empty';
  }

  // LENGTH CHECK (MongoDB ObjectId is always 24 characters)
  if (id?.length !== 24) {
    return VALIDATION_MESSAGES?.ID_LENGTH ?? 'Invalid ID format';
  }

  // HEXADECIMAL FORMAT CHECK
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return VALIDATION_MESSAGES?.ID_HEX ?? 'Invalid ID format (hex)';
  }

  // MONGOOSE VALIDATION
  if (!mongoose?.Types?.ObjectId?.isValid?.(id)) {
    return VALIDATION_MESSAGES?.ID_MONGO ?? 'Invalid ObjectId';
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
};
// endregion
