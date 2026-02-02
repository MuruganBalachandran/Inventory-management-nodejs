// region imports
const express = require('express');
const router = express.Router();

// utils
const { sendResponse } = require('../../utils/common/commonFunctions');

// constants
const { STATUS_CODE, RESPONSE_STATUS } = require('../../utils/constants/constants');
// endregion


// region health check route
/**
 * Simple health check endpoint to verify API uptime.
 */
router.get('/', (req, res) => {
  // send standard API response to confirm server health
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
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
