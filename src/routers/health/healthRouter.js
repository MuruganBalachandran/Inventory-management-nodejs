// region imports
const express = require('express');
const router = express.Router();

// utils
const sendResponse = require('../../utils/common/sendResponse');

// constants
const { STATUS_CODE } = require('../../utils/constants/constants');
// endregion


// region health check route
router.get('/', (req, res) => {

  // send standard API response to confirm server health
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    'API is healthy',
    {
      timestamp: new Date().toISOString(), // include server time for monitoring
    }
  );
});
// endregion


// region exports
module.exports = { healthRouter: router };
// endregion
