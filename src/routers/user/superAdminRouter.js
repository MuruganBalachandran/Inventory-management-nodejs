// region imports
const express = require('express');
const auth = require('../../middleware/auth/auth');
const superAdminOnly = require('../../middleware/auth/superAdminOnly');
const { signup, deleteAccount } = require('../../controllers/user/userController');
// endregion

// region router initialization
const router = express.Router();
// endregion

// region super admin routes
/**
 * Routes strictly reserved for the Super Admin.
 */

// Only Super Admin can create Admin accounts (Uses unified signup with hierarchy logic)
router.post('/create-admin', auth, superAdminOnly, signup);

// Only Super Admin can delete Admin accounts (Uses unified deletion with hierarchy logic)
router.delete('/delete-admin/:id', auth, superAdminOnly, deleteAccount);
// endregion

// region exports
module.exports = { superAdminRouter: router };
// endregion
