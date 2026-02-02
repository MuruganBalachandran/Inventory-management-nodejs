// region imports
const {
  validateInventoryName,
  validatePrice,
  validateQuantity,
  validateCategory,
  validateObjectId,
} = require('../helpers/typeValidations');

const { validationError } = require('../helpers/validationError');
const { VALIDATION_MESSAGES } = require('../../utils/constants/constants');
// endregion

// region validate create inventory
/**
 * Validates inventory creation data.
 * Ensures Name and Price are provided and correctly formatted.
 */
const validateCreateInventory = (data = {}) => {
  const errors = [];

  const { Name, Price, Quantity, Category } = data ?? {};

  // region Name
  const nameError = validateInventoryName(Name);
  if (nameError) {
    errors.push(nameError);
  }
  // endregion

  // region Price
  const priceError = validatePrice(Price);
  if (priceError) {
    errors.push(priceError);
  }
  // endregion

  // region Quantity (optional)
  if (Quantity !== undefined) {
    const qtyError = validateQuantity(Quantity);
    if (qtyError) {
      errors.push(qtyError);
    }
  }
  // endregion

  // region Category (optional but validated if provided)
  if (Category !== undefined) {
    const categoryError = validateCategory(Category);
    if (categoryError) {
      errors.push(categoryError);
    }
  }
  // endregion

  // region result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region validate update inventory
/**
 * Validates inventory update data.
 * Ensures only allowed fields are provided for updating existing items.
 */
const validateUpdateInventory = (data = {}) => {
  const allowedUpdates = ['Name', 'Price', 'Quantity', 'Category'];
  const updates = Object.keys(data ?? {});
  const errors = [];

  // region no fields
  if (updates?.length === 0) {
    errors.push(VALIDATION_MESSAGES?.NO_FIELDS_FOR_UPDATE ?? 'No fields provided for update');
  }
  // endregion

  // region invalid fields
  const invalidFields = updates?.filter?.((key) => !allowedUpdates?.includes?.(key)) ?? [];
  if (invalidFields?.length > 0) {
    errors.push(
      `${VALIDATION_MESSAGES?.INVALID_FIELDS_UPDATE ?? 'You cannot update the field(s)'}: ${invalidFields?.join?.(', ')}`
    );
  }
  // endregion

  const { Name, Price, Quantity, Category } = data ?? {};

  // region Name
  if (Name !== undefined) {
    const nameError = validateInventoryName(Name);
    if (nameError) {
      errors.push(nameError);
    }
  }
  // endregion

  // region Price
  if (Price !== undefined) {
    const priceError = validatePrice(Price);
    if (priceError) {
      errors.push(priceError);
    }
  }
  // endregion

  // region Quantity
  if (Quantity !== undefined) {
    const qtyError = validateQuantity(Quantity);
    if (qtyError) {
      errors.push(qtyError);
    }
  }
  // endregion

  // region Category
  if (Category !== undefined) {
    const categoryError = validateCategory(Category);
    if (categoryError) {
      errors.push(categoryError);
    }
  }
  // endregion

  // region result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region validate id
/**
 * Validates a single MongoDB ObjectId (used for item retrieval/delete).
 */
const validateId = (id = '') => {
  const idError = validateObjectId(id);
  if (idError) {
    return validationError([idError]);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate user id
/**
 * Validates a User ID string.
 */
const validateUserId = (userId = '') => {
  const idError = validateObjectId(userId);
  if (idError) {
    return validationError([idError]);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate inventory search query
/**
 * Validates query parameters for inventory searching and filtering.
 * Supports pagination (page, limit), price filters, and sorting.
 */
const validateInventoryQuery = (query = {}) => {
  const errors = [];
  const { page, limit, minPrice, maxPrice, sortBy, sortOrder } = query ?? {};

  // validate page
  if (page !== undefined && (isNaN(page) || Number(page) < 1)) {
    errors.push(VALIDATION_MESSAGES?.PAGE_POSITIVE ?? 'Page must be a positive number');
  }

  // validate limit
  if (limit !== undefined && (isNaN(limit) || Number(limit) < 1)) {
    errors.push(VALIDATION_MESSAGES?.LIMIT_POSITIVE ?? 'Limit must be a positive number');
  }

  // validate price range
  if (minPrice !== undefined && (isNaN(minPrice) || Number(minPrice) < 0)) {
    errors.push(VALIDATION_MESSAGES?.MIN_PRICE_NON_NEGATIVE ?? 'Minimum price must be a non-negative number');
  }
  if (maxPrice !== undefined && (isNaN(maxPrice) || Number(maxPrice) < 0)) {
    errors.push(VALIDATION_MESSAGES?.MAX_PRICE_NON_NEGATIVE ?? 'Maximum price must be a non-negative number');
  }
  if (minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice)) {
    errors.push(VALIDATION_MESSAGES?.MIN_PRICE_MAX_PRICE_LOGIC ?? 'Minimum price cannot be greater than maximum price');
  }

  // validate sort fields
  const allowedSortFields = ['Price', 'Quantity', 'Created_At'];
  if (sortBy !== undefined && !allowedSortFields?.includes?.(sortBy)) {
    errors.push(`${VALIDATION_MESSAGES?.INVALID_SORT_FIELD ?? 'Invalid sort field provided'}. Allowed: ${allowedSortFields?.join?.(', ')}`);
  }

  // validate sort order
  if (sortOrder !== undefined && !['asc', 'desc']?.includes?.(sortOrder)) {
    errors.push(VALIDATION_MESSAGES?.INVALID_SORT_ORDER ?? 'Sort order must be either asc or desc');
  }

  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
module.exports = {
  validateCreateInventory,
  validateUpdateInventory,
  validateId,
  validateUserId,
  validateInventoryQuery,
};
// endregion
