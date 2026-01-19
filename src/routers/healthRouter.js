// region imports
const express = require('express')
const STATUS_CODE = require("../constants/statusCodes")
const sendResponse = require("../utils/sendResponse")
// endregion

// region create router
const router = express.Router()
// endregion

// region health check,
router.get('/health', (req, res) => {
return sendResponse(res, STATUS_CODE.OK, "ok", "Service is healthy");
})
// endregion

// region exports
module.exports = router
// endregion