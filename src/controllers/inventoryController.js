// region utils imports
const sendResponse = require('../utils/sendResponse');
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
const STATUS_CODE = require('../constants/statusCodes');
const { INVENTORY_MESSAGES } = require('../constants/messages');
// endregion

// region create inventory controller
const createInventory = async (req, res) => {
  try {
    const validation = validateCreateInventory(req.body);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const {
      name = '',
      price = 0,
      quantity = 0,
      category = 'others',
    } = req.body;

    const item = await createInventoryItem({
      name,
      price,
      quantity,
      category,
      createdBy: req.user?._id,
    });

    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      'ok',
      INVENTORY_MESSAGES.ITEM_CREATED,
      item
    );
  } catch (err) {
    if (err?.name === 'ValidationError') {
      const validationMessage =
        Object.values(err.errors)?.[0]?.message ||
        INVENTORY_MESSAGES.ITEM_NOT_FOUND;
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        'error',
        validationMessage
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
// endregion

// region get all inventory controller
const getAllInventory = async (req, res) => {
  try {
    const data = await getAllInventoryItems({
      ownerId: null,
      query: req.query ?? {},
      populateUser: true,
    });

    if (!data || data.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        'error',
        INVENTORY_MESSAGES.NO_RECORDS_FOUND
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      INVENTORY_MESSAGES.ITEMS_FETCHED,
      data
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
// endregion

// region get inventory by id controller
const getInventoryById = async (req, res) => {
  try {
    const { id = '' } = req.params;

    const validation = validateId(id);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const item = await findInventoryById(id);

    if (!item) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        'error',
        INVENTORY_MESSAGES.ITEM_NOT_FOUND
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      INVENTORY_MESSAGES.ITEMS_FETCHED,
      item
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
// endregion

// region update inventory controller
const updateInventory = async (req, res) => {
  try {
    const { id = '' } = req.params;

    let validation = validateId(id);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    validation = validateUpdateInventory(req.body);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const {
      name,
      price,
      quantity = 0,
      category = 'others',
    } = req.body;

    const isAdmin = req.user?.role === 'admin';
    const userId = isAdmin ? null : req.user?._id;

    const updated = await updateInventoryItem(id, userId, {
      name,
      price,
      quantity,
      category,
    }, isAdmin);

    if (!updated) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        'error',
        INVENTORY_MESSAGES.NOT_ALLOWED_TO_UPDATE
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      INVENTORY_MESSAGES.ITEM_UPDATED,
      updated
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
// endregion

// region delete inventory controller
const deleteInventory = async (req, res) => {
  try {
    const { id = '' } = req.params;

    const validation = validateId(id);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const isAdmin = req.user?.role === 'admin';
    const userId = isAdmin ? null : req.user?._id;

    const removed = await deleteInventoryItem(id, userId, isAdmin);

    if (!removed) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        'error',
        INVENTORY_MESSAGES.NOT_ALLOWED_TO_UPDATE
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      INVENTORY_MESSAGES.ITEM_DELETED,
      removed
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
// endregion

// region get my inventory controller
const getMyInventory = async (req, res) => {
  try {
    const data = await getAllInventoryItems({
      ownerId: req.user?._id,
      query: req.query ?? {},
    });

    if (!data || data.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        'error',
        INVENTORY_MESSAGES.NO_RECORDS_FOUND
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      INVENTORY_MESSAGES.ITEMS_FETCHED,
      data
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
// endregion

// region get inventory by user controller
const getInventoryByUser = async (req, res) => {
  try {
    const userId = req.params?.userId ?? '';

    const validation = validateUserId(userId);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const data = await getAllInventoryItems({
      ownerId: userId,
      query: req.query ?? {},
      populateUser: true,
    });

    if (!data || data.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        'error',
        INVENTORY_MESSAGES.NO_RECORDS_FOUND
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      INVENTORY_MESSAGES.ITEMS_FETCHED,
      data
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || INVENTORY_MESSAGES.ITEM_NOT_FOUND
    );
  }
};
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

