// region imports
const express = require('express')
// endregion

// region create router
const router = express.Router()
// endregion

// region health check,
router.get('/health', (req, res) => {
  try{
  res?.status(200)?.send({
    status: 'OK',
    timestamp: new Date().toISOString()
  })
  }catch(err){
    console.log("error:",err)
    res?.status(500)?.send({
    status: 'Not Ok',
    timestamp: new Date().toISOString()
  })
  }
})
// endregion

// region exports
module.exports = router
// endregion