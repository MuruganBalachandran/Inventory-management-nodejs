// region utils imports
const sendResponse = require('../utils/sendResponse');
const asyncHandler = require('../utils/asyncHandler');
// endregion

// region queries imports
const {
  createInventoryItem,
  findInventoryById,
  getAllInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../queries');
// endregion

// region validations imports
const {
  validateCreateInventory,
  validateUpdateInventory,
  validateId,
  validateUserId,
} = require('../validations');
// endregion

// region constants imports
const { STATUS_CODE, INVENTORY_MESSAGES } = require('../utils/constants');
// endregion

// region create inventory controller
const createInventory = asyncHandler(async (req, res) => {
  // validate input
  const validation = validateCreateInventory(req.body);
  if (!validation.isValid) {
    return sendResponse(
      res,
      validation.statusCode,
      'error',
      validation.error
    );
  }
// extract fields
  const {
    name = '',
    price = 0,
    quantity = 0,
    category = 'others',
  } = req.body;

  // create inventory item
  const item = await createInventoryItem({
    name,
    price,
    quantity,
    category,
    createdBy: req.user?._id,
  });
// send response
  return sendResponse(
    res,
    STATUS_CODE.CREATED,
    'ok',
    INVENTORY_MESSAGES.ITEM_CREATED,
    item
  );
}, { isValidationContext: true });
// endregion

// region get all inventory controller
const getAllInventory = asyncHandler(async (req, res) => {
  // get all inventory items
  const result = await getAllInventoryItems({
    ownerId: null,
    query: req.query ?? {},
    populateUser: true,
  });
// extract items and pagination
  const { items, pagination } = result;
// handle no records found
  if (!items || items.length === 0) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.NO_RECORDS_FOUND
    );
  }
// send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    INVENTORY_MESSAGES.ITEMS_FETCHED,
    { items, pagination }
  );
});
// endregion

// region get inventory by id controller
const getInventoryById = asyncHandler(async (req, res) => {
  // extract id from params
  const { id = '' } = req.params;
// validate id
  const validation = validateId(id);
  if (!validation.isValid) {
    return sendResponse(
      res,
      validation.statusCode,
      'error',
      validation.error
    );
  }
// find inventory item by id
  const item = await findInventoryById(id);
// handle item not found
  if (!item) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
// send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    INVENTORY_MESSAGES.ITEMS_FETCHED,
    item
  );
});
// endregion

// region update inventory controller
const updateInventory = asyncHandler(async (req, res) => {
  // extract id from params
  const { id = '' } = req.params;
// validate id
  let validation = validateId(id);
  // handle invalid id
  if (!validation.isValid) {
    return sendResponse(
      res,
      validation.statusCode,
      'error',
      validation.error
    );
  }
// validate input
  validation = validateUpdateInventory(req.body);
  if (!validation.isValid) {
    return sendResponse(
      res,
      validation.statusCode,
      'error',
      validation.error
    );
  }
// extract fields
  const {
    name,
    price,
    quantity = 0,
    category = 'others',
  } = req.body;
// update inventory item
  const isAdmin = req.user?.role === 'admin';
  const userId = isAdmin ? null : req.user?._id;
// perform update
  const updated = await updateInventoryItem(id, userId, {
    name,
    price,
    quantity,
    category,
  }, isAdmin);
// handle not allowed to update
  if (!updated) {
    return sendResponse(
      res,
      STATUS_CODE.FORBIDDEN,
      'error',
      INVENTORY_MESSAGES.NOT_ALLOWED_TO_UPDATE
    );
  }
// send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    INVENTORY_MESSAGES.ITEM_UPDATED,
    updated
  );
});
// endregion

// region delete inventory controller
const deleteInventory = asyncHandler(async (req, res) => {
  // extract id from params
  const { id = '' } = req.params;
// validate id
  const validation = validateId(id);
  if (!validation.isValid) {
    return sendResponse(
      res,
      validation.statusCode,
      'error',
      validation.error
    );
  }
// delete inventory item
  const isAdmin = req.user?.role === 'admin';
  const userId = isAdmin ? null : req.user?._id;
// perform delete
  const removed = await deleteInventoryItem(id, userId, isAdmin);

  if (!removed) {
    return sendResponse(
      res,
      STATUS_CODE.FORBIDDEN,
      'error',
      INVENTORY_MESSAGES.NOT_ALLOWED_TO_DELETE
    );
  }
// send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    INVENTORY_MESSAGES.ITEM_DELETED,
    removed
  );
});
// endregion

// region get my inventory controller
const getMyInventory = asyncHandler(async (req, res) => {
  // get my inventory items
  const result = await getAllInventoryItems({
    ownerId: req.user?._id,
    query: req.query ?? {},
  });
// extract items and pagination
  const { items, pagination } = result;
// handle no records found
  if (!items || items.length === 0) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.NO_RECORDS_FOUND
    );
  }
// send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    INVENTORY_MESSAGES.ITEMS_FETCHED,
    { items, pagination }
  );
});
// endregion

// region get inventory by user controller
const getInventoryByUser = asyncHandler(async (req, res) => {
  // extract userId from params
  const userId = req.params?.userId ?? '';
// validate userId
  const validation = validateUserId(userId);
  if (!validation.isValid) {
    return sendResponse(
      res,
      validation.statusCode,
      'error',
      validation.error
    );
  }
// get inventory items by user
  const result = await getAllInventoryItems({
    ownerId: userId,
    query: req.query ?? {},
    populateUser: true,
  });
// extract items and pagination
  const { items, pagination } = result;
// handle no records found
  if (!items || items.length === 0) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.NO_RECORDS_FOUND
    );
  }
// send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    INVENTORY_MESSAGES.ITEMS_FETCHED,
    { items, pagination }
  );
});
// endregion

// region exports
module.exports = {
  createInventory,
  updateInventory,
  deleteInventory,
  getAllInventory,
  getInventoryById,
  getMyInventory,
  getInventoryByUser,
};
// endregion

