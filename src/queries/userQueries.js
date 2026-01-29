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
    }
};
// endregion

// region generate user token query
const generateUserToken = async (user = {}) => {
    try {
        const token = generateToken(user?._id?.toString());

        user.tokens = (user.tokens ?? []).concat({ token });

        await user.save();

        return token ?? '';
    } catch (err) {
        console.error('Error generating user token:', err);
    }
};
// endregion

// region remove user token query
const removeUserToken = async (user = {}, token = '') => {
    try {
        user.tokens = (user.tokens ?? []).filter((t) => t.token !== token);

        await user.save();

        return user ?? null;
    } catch (err) {
        console.error('Error removing user token:', err);
    }
};
// endregion

// region clear all user tokens query
const clearAllUserTokens = async (user = {}) => {
    try {
        user.tokens = [];

        await user.save();

        return user ?? null;
    } catch (err) {
        console.error('Error clearing user tokens:', err);
    }
};
// endregion

// region update user profile query
const updateUserProfile = async (user = {}, updateData = {}) => {
    try {
        const { name, password, age } = updateData;

        let isChanged = false;

        if (name !== undefined && name !== user.name) {
            user.name = name.trim();
            isChanged = true;
        }

        if (password !== undefined) {
            user.password = password;
            isChanged = true;
        }

        if (age !== undefined && age !== user.age) {
            user.age = age;
            isChanged = true;
        }

        if (!isChanged) {
            return null;
        }


        await user.save();

        return user ?? null;
    } catch (err) {
        console.error('Error updating user profile:', err);
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
    }
};
// endregion

// region exports
module.exports = {
    findUserByToken,
    createUser,
    authenticateUserByCredentials,
    generateUserToken,
    removeUserToken,
    clearAllUserTokens,
    updateUserProfile,
    deleteUserAccount,
};
// endregion
