// region imports
// package imports
const express = require('express');

// middleware imports
const auth = require('../../middleware/auth/auth'); // verifies JWT and attaches req.user
const adminOnly = require('../../middleware/auth/adminOnly'); // role protection

// rate limiter imports to prevent brute-force attacks
const {
  loginLimiter,
  signupLimiter,
  signupLimiterByEmail,
  loginLimiterByEmail,
} = require('../../middleware/rateLimiter/rateLimiter');
// endregion

// region controller imports
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
  getAllRegisteredUsers,
} = require('../../controllers/user/userController');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region public routes

// user registration with rate limiting to prevent abuse
router.post('/signup', signupLimiter, signupLimiterByEmail, signup);

// login with rate limiting to prevent credential stuffing
router.post('/login', loginLimiter, loginLimiterByEmail, login);

// endregion

// region protected routes
/**
 * Protected routes: Requires valid JWT token.
 */

// logout invalidates token/session
router.post('/logout', auth, logout);

// fetch logged-in user's profile
router.get('/me', auth, getProfile);

// update logged-in user's profile
router.patch('/me', auth, updateProfile);

// permanently delete or soft-delete user account
router.delete('/me', auth, deleteAccount);

// admin routes to manage all users
router.get('/', auth, adminOnly, getAllRegisteredUsers);
router.delete('/:id', auth, adminOnly, deleteAccount);

// endregion

// region exports
module.exports = { userRouter: router };
// endregion
