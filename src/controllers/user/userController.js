// region imports
// package imports
const {
  hashPassword,
  verifyPassword,
  generateToken,
  sendResponse,
} = require('../../utils/common/commonFunctions');
const { env } = require('../../config/env/envConfig');

// model imports
const User = require('../../models/user/userModel');

// validation imports
const {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
} = require('../../validations/user/userValidation');

// query imports
const {
  createUser,
  findUserByEmail,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  findUserById,
} = require('../../queries/user/userQueries');

// constants imports
const {
  STATUS_CODE,
  AUTH_MESSAGES,
  USER_MESSAGES,
  RESPONSE_STATUS,
} = require('../../utils/constants/constants');
const { asyncHandler } = require('../../utils/common/commonFunctions');
// endregion

// region signup controller
/**
 * Handles user registration / admin creation.
 * Reuses the same logic for public signup and super-admin admin creation.
 */
const signup = asyncHandler(async (req, res) => {
  // validate input against rules
  const validation = validateSignup(req.body ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid input'
    );
  }

  // extract fields with robust defaults from req.body
  const {
    Name = '',
    Email = '',
    Password = '',
    Age = 0,
  } = req.body ?? {};

  // Determine role based on security context:
  // - Public signup: strictly force 'user'
  // - Super Admin: allow dynamic role (defaults to admin if used for creation)
  const Role = req.user?.Role === 'super_admin' ? (req.body?.Role || 'admin') : 'user';

  // check if email already exists
  const existingUser = await findUserByEmail(Email);
  if (existingUser) {
    return sendResponse(
      res,
      STATUS_CODE?.CONFLICT ?? 409,
      RESPONSE_STATUS?.ERROR ?? 'error',
      AUTH_MESSAGES?.EMAIL_ALREADY_EXISTS ?? 'Email already registered'
    );
  }

  // create user in DB (Model hook will handle hashing automatically)
  const user = await createUser({
    Name,
    Email,
    Password,
    Age,
    Role,
  });

  // send success response
  const successMessage = Role === 'user' 
    ? (AUTH_MESSAGES?.REGISTRATION_SUCCESS ?? 'User registered successfully')
    : 'Account created successfully';

  return sendResponse(
    res,
    STATUS_CODE?.CREATED ?? 201,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    successMessage,
    user
  );
});
// endregion

// region login controller
/**
 * Authenticates user and returns JWT token.
 */
const login = asyncHandler(async (req, res) => {
  // validate login input
  const validation = validateLogin(req.body ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid input'
    );
  }

  const { Email = '', Password = '' } = req.body ?? {};
  
  // fetch user by email
  const user = await findUserByEmail(Email);

  // verify password
  const isPasswordValid = user && (await verifyPassword(Password, user.Password || ""));
  
  // send response for invalid credentials
  if (!user || !isPasswordValid) {
    return sendResponse(
      res,
      STATUS_CODE?.UNAUTHORIZED ?? 401,
      RESPONSE_STATUS?.ERROR ?? 'error',
      AUTH_MESSAGES?.INVALID_CREDENTIALS ?? 'Invalid credentials'
    );
  }

  // generate JWT token (stateless)
  const token = generateToken(user._id?.toString() ?? "");

  // send success response
  return sendResponse(
    res, 
    STATUS_CODE?.OK ?? 200, 
    RESPONSE_STATUS?.SUCCESS ?? 'ok', 
    AUTH_MESSAGES?.LOGIN_SUCCESS ?? 'Login successful', 
    {
      user,
      token,
    }
  );
});
// endregion

// region logout controller
/**
 * Log out user (Client-side token removal).
 */
const logout = asyncHandler(async (req, res) => {
  // placeholder: token removal not implemented
  return sendResponse(
    res, 
    STATUS_CODE?.OK ?? 200, 
    RESPONSE_STATUS?.SUCCESS ?? 'ok', 
    AUTH_MESSAGES?.LOGOUT_SUCCESS ?? 'Logged out successfully'
  );
});
// endregion

// region get profile controller
/**
 * Fetches the currently authenticated user's profile.
 */
const getProfile = asyncHandler(async (req, res) => {
  // return current authenticated user
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    USER_MESSAGES?.PROFILE_FETCHED ?? 'Profile fetched successfully',
    { user: req.user ?? null }
  );
});
// endregion

// region update profile controller
/**
 * Updates the profile of the currently authenticated user.
 */
const updateProfile = asyncHandler(async (req, res) => {
  // validate update input
  const validation = validateUpdateProfile(req.body ?? {});
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? (STATUS_CODE?.BAD_REQUEST ?? 400),
      RESPONSE_STATUS?.ERROR ?? 'error',
      validation?.error ?? 'Invalid input'
    );
  }

  const { Name, Password, Age } = req.body ?? {};

  // update user profile
  const updatedUser = await updateUserProfile(req.user ?? {}, {
    Name,
    Password,
    Age,
  });

  if (!updatedUser) {
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? 'ok',
      USER_MESSAGES?.NO_CHANGES_DETECTED ?? 'No changes detected'
    );
  }

  // send success response
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    USER_MESSAGES?.PROFILE_UPDATED ?? 'Profile updated successfully',
    updatedUser
  );
});
// endregion

// region delete user controller (Unified: handles self and admin-initiated)
/**
 * Unifies account deletion for all users.
 * Supports self-deletion (/me) and hierarchical admin removal (/:id).
 */
const deleteAccount = asyncHandler(async (req, res) => {
  // If id is provided in params, we are deleting someone else (Admin action)
  // If id is missing or "me", we are deleting ourselves.
  const paramId = req.params?.id;
  const isSelfDeletion = !paramId || paramId === 'me' || paramId === req.user?._id?.toString();

  let targetUser;

  if (isSelfDeletion) {
    targetUser = req.user;
  } else {
    // Hierarchical check for Admin action
    targetUser = await findUserById(paramId);
    if (!targetUser) {
      return sendResponse(res, STATUS_CODE?.NOT_FOUND ?? 404, RESPONSE_STATUS?.ERROR ?? 'error', 'User not found');
    }

    const currentUserRole = req.user?.Role;
    const targetUserRole = targetUser.Role;

    // Block Admins from deleting privileged accounts (other Admins or the Super Admin)
    if (currentUserRole === 'admin' && (targetUserRole === 'admin' || targetUserRole === 'super_admin')) {
      return sendResponse(
        res,
        STATUS_CODE?.FORBIDDEN ?? 403,
        RESPONSE_STATUS?.ERROR ?? 'error',
        'Admins can only delete standard user accounts'
      );
    }
  }

  // Proceed with deletion via centralized logic
  const deletedUser = await deleteUserAccount(targetUser);

  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    isSelfDeletion ? 'Account deleted successfully' : 'User deleted successfully',
    deletedUser
  );
});
// endregion

// region admin management (for all users)
/**
 * Fetches all users registered in the system (Admin only).
 */
const getAllRegisteredUsers = asyncHandler(async (req, res) => {
  const result = await getAllUsers(req.query ?? {});
  
  return sendResponse(
    res,
    STATUS_CODE?.OK ?? 200,
    RESPONSE_STATUS?.SUCCESS ?? 'ok',
    'Users fetched successfully',
    result
  );
});

// (removeUser removal done via merge above)
// endregion

// region exports
module.exports = {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
  getAllRegisteredUsers,
};
// endregion
