// region model imports
const mongoose = require('mongoose');
const User = require('../../models/user/userModel');
const Inventory = require('../../models/inventory/inventoryModel');
const { getFormattedDateTime, toObjectId } = require('../../utils/common/commonFunctions');
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
    } = userData ?? {};

    // Create new user instance
    const user = new User({
      Name: Name?.trim?.() || "",                 
      Email: Email?.trim?.()?.toLowerCase?.() || "", 
      Password: Password || "",                 // pre-save hook will hash
      Age: Age || 0,
      Role: Role || 'user',                     // Use provided role or default to user
    });

    // Save user in DB - Mongoose model call, no ?.
    await user.save();

    // Return created user
    return user;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};
// endregion

// region find user by email
/**
 * Looks up an active user by their email address.
 * Includes the Password field (hidden by default) for authentication checks.
 */
const findUserByEmail = async (email = '') => {
  try {
    // Find active user by email, include Password for authentication
    // Mongoose model call, no ?.
    const user = await User.findOne({
      Email: email?.trim?.()?.toLowerCase?.() || "",
      Is_Deleted: false,
    }).select('+Password');

    // Return null if not found
    return user;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};
// endregion

// region update user profile
/**
 * Updates details of an existing user document.
 * Only processes fields that have actual changes.
 */
const updateUserProfile = async (user = {}, updateData = {}) => {
  try {
    const allowedFields = ['Name', 'Password', 'Age'];
    let isChanged = false;

    // Iterate through allowed fields and update if changed
    for (const field of allowedFields) {
      if (
        updateData?.[field] !== undefined &&
        updateData?.[field] !== user?.[field]
      ) {
        // Update Name with trim, other fields directly
        user[field] = field === 'Name' ? (updateData?.[field]?.trim?.() || "") : updateData?.[field];
        isChanged = true;
      }
    }

    // Return null if no fields changed
    if (!isChanged) return null;

    // Update manual Updated_At timestamp
    user.Updated_At = getFormattedDateTime() || new Date().toISOString();

    // Save updated user (pre-save hashes password if changed) - Mongoose call, no ?.
    await user.save();

    // Return updated user
    return user;
  } catch (err) {
    console.error('Error updating user profile:', err);
    throw err;
  }
};
// endregion

// region delete user account
/**
 * Soft-deletes a user and ALL their inventory items.
 * @param {Object|String} target - The User document or its ID.
 */
const deleteUserAccount = async (target = {}) => {
  try {
    let user = target;
    
    // If target is an ID, find the user first
    if (typeof target === 'string' || mongoose?.isValidObjectId?.(target)) {
      user = await User.findById(target);
    }

    if (!user || user?.Is_Deleted) return null;

    // Prevent deletion of super admin
    if (user?.Role === 'super_admin') {
      throw new Error('Super Admin account cannot be deleted');
    }

    // Soft-delete all inventory items created by user
    await Inventory.updateMany(
      { Created_By: user?._id, Is_Deleted: false },
      {
        $set: {
          Is_Deleted: true,
          Quantity: 0,
          Updated_At: getFormattedDateTime() || new Date().toISOString(),
        },
      }
    );

    // Soft-delete user account
    user.Is_Deleted = true;
    user.Updated_At = getFormattedDateTime() || new Date().toISOString();

    await user.save();
    return user;
  } catch (err) {
    console.error('Error deleting user account:', err);
    throw err;
  }
};
// endregion


// region admin management (Super Admin only checks handled in controller)
/**
 * Internal: Locates the system's Super Admin.
 */
const findSuperAdmin = async () => {
  try {
    return await User.findOne({ Role: 'super_admin', Is_Deleted: false });
  } catch (err) {
    console.error('Error finding super admin:', err);
    throw err;
  }
};

/**
 * Fetches an active user by their primary ID.
 */
const findUserById = async (id = '') => {
  try {
    return await User.findOne({ _id: id, Is_Deleted: false });
  } catch (err) {
    console.error('Error finding user by ID:', err);
    throw err;
  }
};

/**
 * Lists all active users with pagination.
 */
const getAllUsers = async (query = {}) => {
  try {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Number(query?.limit) || 20);
    const skip = (page - 1) * limit;

    const users = await User.find({ Is_Deleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ Created_At: -1 });

    const total = await User.countDocuments({ Is_Deleted: false });

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  } catch (err) {
    console.error('Error fetching all users:', err);
    throw err;
  }
};

/**
 * Creation hook specifically for the initial Super Admin account.
 */
const createInitialSuperAdmin = async (email, password) => {
  try {
    const superAdmin = new User({
      Name: 'Super Admin',
      Email: email?.trim?.()?.toLowerCase?.() || "",
      Password: password,
      Role: 'super_admin',
    });
    await superAdmin.save();
    return superAdmin;
  } catch (err) {
    console.error('Error creating initial super admin:', err);
    throw err;
  }
};

// region exports
module.exports = {
  createUser,
  findUserByEmail,
  updateUserProfile,
  deleteUserAccount,
  findSuperAdmin,
  findUserById,
  getAllUsers,
  createInitialSuperAdmin,
};
// endregion
