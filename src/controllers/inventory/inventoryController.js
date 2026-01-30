// region imports
// utils imports
const sendResponse = require('../../utils/common/sendResponse');
const asyncHandler = require('../../utils/common/asyncHandler');

// queries imports
const {
  createInventoryItem,
  findInventoryById,
  getAllInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../../queries/inventory/inventoryQueries');

// validations imports
const {
  validateCreateInventory,
  validateUpdateInventory,
  validateId,
  validateUserId,
} = require('../../validations/inventory/inventoryValidation');

// constants imports
const {
  STATUS_CODE,
  INVENTORY_MESSAGES,
} = require('../../utils/constants/constants');
// endregion

// region create inventory controller
const createInventory = asyncHandler(
  async (req, res) => {
    // validate request body
    const validation = validateCreateInventory(req.body);
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode ?? STATUS_CODE.BAD_REQUEST,
        'error',
        validation?.error ?? 'Invalid input'
      );
    }

    // extract PascalCase fields
    const {
      Name = '',
      Price = 0,
      Quantity = 0,
      Category = 'others',
    } = req.body;

    // create inventory item in DB
    const item = await createInventoryItem({
      Name,
      Price,
      Quantity,
      Category,
      Created_By: req.user?._id,
    });

    // send success response
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      'ok',
      INVENTORY_MESSAGES.ITEM_CREATED,
      item
    );
  }
);
// endregion

// region get all inventory controller
const getAllInventory = asyncHandler(async (req, res) => {
  // fetch all inventory items with optional query
  const result = await getAllInventoryItems({
    ownerId: null,
    query: req.query ?? {},
    populateUser: true,
  });

  const { items, pagination } = result;

  // check if no records found
  if (!items?.length) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.NO_RECORDS_FOUND
    );
  }

  // send success response
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
  const id = req.params?.id ?? '';

  // validate inventory ID
  const validation = validateId(id);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode,
      'error',
      validation?.error
    );
  }

  // fetch inventory item by ID
  const item = await findInventoryById(id);

  if (!item) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }

  // send success response
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
  const id = req.params?.id ?? '';

  // validate inventory ID
  let validation = validateId(id);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode,
      'error',
      validation?.error
    );
  }

  // validate request body for updates
  validation = validateUpdateInventory(req.body);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode,
      'error',
      validation?.error
    );
  }

  // extract PascalCase fields
  const { Name, Price, Quantity = 0, Category = 'others' } = req.body;

  // determine ownership/admin rights
  const isAdmin = req.user?.Role === 'admin';
  const userId = isAdmin ? null : req.user?._id;

  // update inventory item
  const updated = await updateInventoryItem(
    id,
    userId,
    { Name, Price, Quantity, Category },
    isAdmin
  );

  if (!updated) {
    return sendResponse(
      res,
      STATUS_CODE.FORBIDDEN,
      'error',
      INVENTORY_MESSAGES.NOT_ALLOWED_TO_UPDATE
    );
  }

  // send success response
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
  const id = req.params?.id ?? '';

  // validate inventory ID
  const validation = validateId(id);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode,
      'error',
      validation?.error
    );
  }

  // determine ownership/admin rights
  const isAdmin = req.user?.Role === 'admin';
  const userId = isAdmin ? null : req.user?._id;

  // soft-delete inventory item
  const removed = await deleteInventoryItem(id, userId, isAdmin);

  if (!removed) {
    return sendResponse(
      res,
      STATUS_CODE.FORBIDDEN,
      'error',
      INVENTORY_MESSAGES.NOT_ALLOWED_TO_DELETE
    );
  }

  // send success response
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
  // fetch inventory items created by current user
  const result = await getAllInventoryItems({
    ownerId: req.user?._id,
    query: req.query ?? {},
  });

  const { items, pagination } = result;

  if (!items?.length) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.NO_RECORDS_FOUND
    );
  }

  // send success response
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
  const userId = req.params?.userId ?? '';

  // validate user ID
  const validation = validateUserId(userId);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode,
      'error',
      validation?.error
    );
  }

  // fetch inventory for specified user
  const result = await getAllInventoryItems({
    ownerId: userId,
    query: req.query ?? {},
    populateUser: true,
  });

  const { items, pagination } = result;

  if (!items?.length) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      INVENTORY_MESSAGES.NO_RECORDS_FOUND
    );
  }

  // send success response
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
