// region utils imports
const sendResponse = require('../utils/sendResponse');
// endregion

// region queries imports
const {
  createUser,
  authenticateUserByCredentials,
  generateUserToken,
  removeUserToken,
  clearAllUserTokens,
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
const STATUS_CODE = require('../constants/statusCodes');
const {
  AUTH_MESSAGES,
  USER_MESSAGES,
  VALIDATION_MESSAGES,
} = require('../constants/messages');
// endregion

// region signup controller
const signup = async (req, res) => {
  try {
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

    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      age,
      role,
    });

    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      'ok',
      AUTH_MESSAGES.REGISTRATION_SUCCESS,
      user
    );
  } catch (err) {
    if (err?.code === 11000) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        'error',
        AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    if (err?.name === 'ValidationError') {
      const validationMessage =
        Object.values(err.errors)?.[0]?.message ||
        VALIDATION_MESSAGES.INVALID_INPUT;
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        'error',
        validationMessage
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }
};
// endregion

// region login controller
const login = async (req, res) => {
  try {
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

    const user = await authenticateUserByCredentials(
      email.trim().toLowerCase(),
      password
    );

    const token = await generateUserToken(user);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      AUTH_MESSAGES.LOGIN_SUCCESS,
      { user, token }
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.UNAUTHORIZED,
      'error',
      err?.message || AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }
};
// endregion

// region logout controller
const logout = async (req, res) => {
  try {
    await removeUserToken(req.user, req.token);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      AUTH_MESSAGES.LOGOUT_SUCCESS
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }
};
// endregion

// region logout all controller
const logoutAll = async (req, res) => {
  try {
    await clearAllUserTokens(req.user);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      AUTH_MESSAGES.LOGOUT_ALL_SUCCESS
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }
};
// endregion

// region get profile controller
const getProfile = async (req, res) => {
  return sendResponse(
    res,
    STATUS_CODE.OK,
    'ok',
    USER_MESSAGES.PROFILE_FETCHED,
    { user: req.user ?? null }
  );
};
// endregion

// region update profile controller
const updateProfile = async (req, res) => {
  try {
    const validation = validateUpdateProfile(req.body);
    if (!validation.isValid) {
      return sendResponse(
        res,
        validation.statusCode,
        'error',
        validation.error
      );
    }

    const { name, password, age } = req.body;

    const updatedUser = await updateUserProfile(req.user, {
      name,
      password,
      age,
    });

    if (!updatedUser) {
      return sendResponse(
        res,
        STATUS_CODE.OK,
        'ok',
        USER_MESSAGES.NO_CHANGES_DETECTED,
        { user: req.user }
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      USER_MESSAGES.PROFILE_UPDATED,
      { user: updatedUser }
    );
  } catch (err) {
    if (err?.name === 'ValidationError') {
      const messages = Object.values(err.errors)
        .map((e) => e?.message)
        .filter((msg) => msg);
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        'error',
        messages.join(', ') || VALIDATION_MESSAGES.INVALID_INPUT
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }
};
// endregion

// region delete account controller
const deleteAccount = async (req, res) => {
  try {
    const user = await deleteUserAccount(req.user);

    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        'error',
        USER_MESSAGES.USER_NOT_FOUND
      );
    }

    return sendResponse(
      res,
      STATUS_CODE.OK,
      'ok',
      USER_MESSAGES.ACCOUNT_DELETED,
      { user }
    );
  } catch (err) {
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'error',
      err?.message || AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }
};
// endregion

// region exports
module.exports = {
  signup,
  login,
  logout,
  logoutAll,
  getProfile,
  updateProfile,
  deleteAccount,
};
// endregion
