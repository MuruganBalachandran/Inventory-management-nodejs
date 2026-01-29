// region model imports
const User = require('../models/userModel');
// endregion

// region utils imports
const { verifyPassword, generateToken } = require('../utils');
// endregion

// region find user by token query
const findUserByToken = async (userId = '', token = '') => {
  try {
    const user = await User.findOne({
      _id: userId,
      isDeleted: 0,
      'tokens.token': token,
    });

    return user ?? null;
  } catch (err) {
    console.error('Error finding user by token:', err);
    throw err;
  }
};
// endregion
const createUser = async (userData = {}) => {
  try {
    const {
      name = '',
      email = '',
      password = '',
      age = 0,
      role = 'user',
    } = userData;

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      age,
      role: 'user', // enforce user role
    });

    await user.save();

    return user ?? null;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};
// endregion

// region find user by email query
const findUserByEmail = async (email = '') => {
  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: 0,
    }).select('+password');

    return user ?? null;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};
// endregion

// region authenticate user by credentials query
const authenticateUserByCredentials = async (email = '', password = '') => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user ?? null;
  } catch (err) {
    console.error('Error authenticating user:', err);
    throw err;
  }
};
// endregion

// region update user profile query
const updateUserProfile = async (user = {}, updateData = {}) => {
  try {
    const fields = ['name', 'password', 'age'];
    let isChanged = false;

    // update fields
    for (const field of fields) {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== user[field]
      ) {
        user[field] =
          field === 'name' ? updateData[field].trim() : updateData[field];
        isChanged = true;
      }
    }
    // if no field updated
    if (!isChanged) {
      return null;
    }

    await user.save();

    return user ?? null;
  } catch (err) {
    console.error('Error updating user profile:', err);
    throw err;
  }
};
// endregion

// region delete user account query
const deleteUserAccount = async (user = {}) => {
  try {
    const Inventory = require('../models/inventoryModel');

    await Inventory.updateMany(
      { createdBy: user?._id, isDeleted: 0 },
      { $set: { isDeleted: 1, quantity: 0 } }
    );

    user.tokens = [];
    user.isDeleted = 1;

    await user.save();

    return user ?? null;
  } catch (err) {
    console.error('Error deleting user account:', err);
    throw err;
  }
};
// endregion

// region exports
module.exports = {
  findUserByToken,
  createUser,
  authenticateUserByCredentials,
  updateUserProfile,
  deleteUserAccount,
};
// endregion
