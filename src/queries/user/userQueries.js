// region model imports
const User = require('../../models/user/userModel');
// endregion

// region helper functions
// Convert string to ObjectId safely
const toObjectId = (id = '') => (id ? new require('mongoose').Types.ObjectId(id) : id);
// endregion

// region find user by token
const findUserByToken = async (userId = '', token = '') => {
  try {
    // Find active user by ID and token
    const user = await User.findOne({
      _id: toObjectId(userId),          // convert to ObjectId
      Is_Deleted: false,                // only active users
      'tokens.token': token,            // match token in token array
    });

    // Return null if not found
    return user ?? null;
  } catch (err) {
    console.error('Error finding user by token:', err);
    throw err;
  }
};
// endregion

// region create user
const createUser = async (userData = {}) => {
  try {
    const {
      Name = '',
      Email = '',
      Password = '',
      Age = 0,
      Role = 'user',
    } = userData;

    // Create new user instance
    const user = new User({
      Name: Name.trim(),                 // trim Name
      Email: Email.trim().toLowerCase(), // lowercase Email
      Password,                          // pre-save hook will hash
      Age,
      Role: 'user',                       // force role user
    });

    // Save user in DB
    await user.save();

    // Return created user
    return user ?? null;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};
// endregion

// region find user by email
const findUserByEmail = async (Email = '') => {
  try {
    // Find active user by email, include Password for authentication
    const user = await User.findOne({
      Email: Email.trim().toLowerCase(),
      Is_Deleted: false,
    }).select('+Password');

    // Return null if not found
    return user ?? null;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};
// endregion

// region update user profile
const updateUserProfile = async (user = {}, updateData = {}) => {
  try {
    const allowedFields = ['Name', 'Password', 'Age'];
    let isChanged = false;

    // Iterate through allowed fields and update if changed
    for (const field of allowedFields) {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== user[field]
      ) {
        // Update Name with trim, other fields directly
        user[field] = field === 'Name' ? updateData[field].trim() : updateData[field];
        isChanged = true;
      }
    }

    // Return null if no fields changed
    if (!isChanged) return null;

    // Update manual Updated_At timestamp
    user.Updated_At = new Date();

    // Save updated user (pre-save hashes password if changed)
    await user.save();

    // Return updated user
    return user ?? null;
  } catch (err) {
    console.error('Error updating user profile:', err);
    throw err;
  }
};
// endregion

// region delete user account
const deleteUserAccount = async (user = {}) => {
  try {
    const Inventory = require('../../models/inventory/inventoryModel');

    // Soft-delete all inventory items created by user
    await Inventory.updateMany(
      { Created_By: user?._id, Is_Deleted: false },
      {
        $set: {
          Is_Deleted: true, // mark as deleted
          Quantity: 0,      // reset quantity
        },
      }
    );

    // Soft-delete user account
    user.Is_Deleted = true;

    // Update manual Updated_At timestamp
    user.Updated_At = new Date();

    // Save user changes
    await user.save();

    // Return deleted user
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
  findUserByEmail,
  updateUserProfile,
  deleteUserAccount,
};
// endregion
