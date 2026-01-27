// region package imports
const express = require('express');
// endregion

// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region constants imports
const STATUS_CODE = require('../constants/statusCodes');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region routes
router.get('/health', (req, res) => {
    return sendResponse(
        res,
        STATUS_CODE.OK,
        'ok',
        'Service is healthy'
    );
});
// endregion

// region exports
module.exports = router;
// endregion