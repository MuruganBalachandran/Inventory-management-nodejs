// region utils imports
const sendResponse = require('../utils/sendResponse');
const asyncHandler = require('../utils/asyncHandler');
// endregion

// region queries imports
const {
  createUser,
  authenticateUserByCredentials,
  updateUserProfile,
  deleteUserAccount,
} = require('../queries');
// endregion

// region validations imports
const {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
} = require('../validations');
// endregion

// region constants imports
const {
  STATUS_CODE,
  AUTH_MESSAGES,
  USER_MESSAGES,
} = require('../utils/constants');
const { generateToken } = require('../utils');
// endregion

// region signup controller
const signup = asyncHandler(
  async (req, res) => {
    // validate input
    const validation = validateSignup(req.body);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const {
      name = '',
      email = '',
      password = '',
      age = 0,
      role = 'user',
    } = req.body;
    // create user
    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      age,
      role,
    });
    // send response
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      'ok',
      AUTH_MESSAGES.REGISTRATION_SUCCESS,
      user
    );
  },
  {
    // custom error for duplicate key
    isDuplicateKeyError: true,
    duplicateKeyMessage: AUTH_MESSAGES.EMAIL_ALREADY_EXISTS,
    isValidationContext: true,
  }
);
// endregion

// region login controller
const login = asyncHandler(
  async (req, res) => {
    // validate input
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const { email = '', password = '' } = req.body;

    // authenticate user 
    const user = await authenticateUserByCredentials(
      email.trim().toLowerCase(),
      password
    );

    // generate JWT on the fly, no DB save
    const token = generateToken(user?._id.toString());

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      AUTH_MESSAGES.LOGIN_SUCCESS,
      { user, token }
    );
  },
  { isCustomError: true }
);

// endregion

// region logout controller
const logout = asyncHandler(async (req, res) => {
  // await removeUserToken(req.user, req.token);

  return sendResponse(res, STATUS_CODE.OK, 'ok', AUTH_MESSAGES.LOGOUT_SUCCESS);
});
// endregion

// region get profile controller
const getProfile = asyncHandler(async (req, res) => {
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    USER_MESSAGES.PROFILE_FETCHED,
    { user: req.user ?? null }
  );
});
// endregion

// region update profile controller
const updateProfile = asyncHandler(
  async (req, res) => {
    // validate input
    const validation = validateUpdateProfile(req.body);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }
    // extract fields
    const { name, password, age } = req.body;
    // update profile
    const updatedUser = await updateUserProfile(req.user, {
      name,
      password,
      age,
    });
    // no changes detected
    if (!updatedUser) {
      return sendResponse(
        res,
        STATUS_CODE.OK,
        'ok',
        USER_MESSAGES.NO_CHANGES_DETECTED,
        { user: req.user }
      );
    }
    // send response
    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      USER_MESSAGES.PROFILE_UPDATED,
      { user: updatedUser }
    );
  },
  { isValidationContext: true }
);
// endregion

// region delete account controller
const deleteAccount = asyncHandler(async (req, res) => {
  // delete user account
  const user = await deleteUserAccount(req.user);
  // send response
  if (!user) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      USER_MESSAGES.USER_NOT_FOUND
    );
  }
  // send response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    USER_MESSAGES.ACCOUNT_DELETED,
    { user }
  );
});
// endregion

// region exports
module.exports = {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
};
// endregion
