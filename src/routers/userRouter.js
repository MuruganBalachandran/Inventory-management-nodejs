// region imports
// package imports
const express = require('express');

//  middleware imports
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
// endregion

// region controller imports
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/userController');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region routes
router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', auth, logout);

router.get('/me', auth, getProfile);

router.patch('/me', auth, updateProfile);

router.delete('/me', auth, deleteAccount);
// endregion

// region exports
module.exports = router;
// endregion