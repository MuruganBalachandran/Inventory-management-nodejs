// region utils imports
const sendResponse = require('../../utils/common/sendResponse');
const asyncHandler = require('../../utils/common/asyncHandler');
// endregion

// region queries imports
const {
  createUser,
  updateUserProfile,
  deleteUserAccount,
  findUserByEmail,
} = require('../../queries/user/userQueries');
// endregion

// region validations imports
const {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
} = require('../../validations/user/userValidation');
// endregion

// region constants imports
const {
  STATUS_CODE,
  AUTH_MESSAGES,
  USER_MESSAGES,
} = require('../../utils/constants/constants');
const { generateToken } = require('../../utils/common/jwtUtil');
const { verifyPassword } = require('../../utils/common/hashUtil');
// endregion

// region signup controller
const signup = asyncHandler(async (req, res) => {
  // validate input against rules
  const validation = validateSignup(req.body);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? STATUS_CODE.BAD_REQUEST,
      'error',
      validation?.error ?? 'Invalid input'
    );
  }

  // extract  fields
  const {
    Name = '',
    Email = '',
    Password = '',
    Age = 0,
    Role = 'user',
  } = req.body;

  // check if email already exists
  const existingUser = await findUserByEmail(Email);
  if (existingUser) {
    return sendResponse(
      res,
      STATUS_CODE.CONFLICT, // 409
      'error',
      AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
    );
  }

  // create user in DB
  const user = await createUser({
    Name: Name?.trim(),
    Email: Email?.trim()?.toLowerCase(),
    Password,
    Age,
    Role,
  });

  // send success response
  return sendResponse(
    res,
    STATUS_CODE.CREATED,
    'ok',
    AUTH_MESSAGES.REGISTRATION_SUCCESS,
    user
  );
});
// endregion

// region login controller
const login = asyncHandler(async (req, res) => {
  // validate login input
  const validation = validateLogin(req.body);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? STATUS_CODE.BAD_REQUEST,
      'error',
      validation?.error ?? 'Invalid input'
    );
  }

  const { Email = '', Password = '' } = req.body;
  // if not exists - null
  const user = await findUserByEmail(Email);

  const isPasswordValid =
    user && (await verifyPassword(Password, user.Password));
  // send response for invalid credentials
  if (!user || !isPasswordValid) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }

  // generate JWT token (stateless)
  const token = generateToken(user?._id?.toString());

  // send success response
  return sendResponse(res, STATUS_CODE.OK, 'ok', AUTH_MESSAGES.LOGIN_SUCCESS, {
    user,
    token,
  });
});
// endregion

// region logout controller
const logout = asyncHandler(async (req, res) => {
  // placeholder: token removal not implemented
  return sendResponse(res, STATUS_CODE.OK, 'ok', AUTH_MESSAGES.LOGOUT_SUCCESS);
});
// endregion

// region get profile controller
const getProfile = asyncHandler(async (req, res) => {
  // return current authenticated user
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
const updateProfile = asyncHandler(async (req, res) => {
  // validate update input
  const validation = validateUpdateProfile(req.body);
  if (!validation?.isValid) {
    return sendResponse(
      res,
      validation?.statusCode ?? STATUS_CODE.BAD_REQUEST,
      'error',
      validation?.error ?? 'Invalid input'
    );
  }

  const { Name, Password, Age } = req.body;

  // update user profile
  const updatedUser = await updateUserProfile(req.user, {
    Name,
    Password,
    Age,
  });

  if (!updatedUser) {
    // no fields changed
    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      USER_MESSAGES.NO_CHANGES_DETECTED,
      { user: req.user }
    );
  }

  // send success response
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    USER_MESSAGES.PROFILE_UPDATED,
    { user: updatedUser }
  );
});
// endregion

// region delete account controller
const deleteAccount = asyncHandler(async (req, res) => {
  // soft-delete user and related inventory
  const user = await deleteUserAccount(req.user);

  if (!user) {
    return sendResponse(
      res,
      STATUS_CODE.NOT_FOUND,
      'error',
      USER_MESSAGES.USER_NOT_FOUND
    );
  }

  // send success response
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
