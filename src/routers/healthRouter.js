// region imports
const express = require('express')
<<<<<<< HEAD
const STATUS_CODE = require("../constants/statusCodes")
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region create router
const router = express.Router()
// endregion

// region health check,
router.get('/health', (req, res) => {
<<<<<<< HEAD
return sendResponse(res, STATUS_CODE.OK, "ok", "Service is healthy");
=======
  res?.status(200)?.send({
    status: 'OK',
    timestamp: new Date().toISOString()
  })
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
})
// endregion

// region exports
module.exports = router
// endregion