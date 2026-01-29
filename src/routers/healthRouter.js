// region  imports
// package imports
const express = require('express');

//  utils imports
const sendResponse = require('../utils/sendResponse');

//  constants imports
const { STATUS_CODE } = require('../utils/constants');
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