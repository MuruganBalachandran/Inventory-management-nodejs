// region package imports
const express = require('express');
// endregion

// region middleware imports
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
// endregion

// region controller imports
const {
  signup,
  login,
  logout,
  logoutAll,
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

router.post('/logout-all', auth, logoutAll);

router.get('/me', auth, getProfile);

router.patch('/me', auth, updateProfile);

router.delete('/me', auth, deleteAccount);
// endregion

// region exports
module.exports = router;
// endregion