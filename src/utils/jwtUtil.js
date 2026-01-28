// region package imports
const jwt = require('jsonwebtoken');
// endregion

// region environment config
const { env } = require('../config');
const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRY = '7d';
// endregion

// region generate token utility
const generateToken = (userId = '') => {
    try {
        const token = jwt.sign(
            { _id: userId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );
        return token ?? '';
    } catch (err) {
        return '';
    }
};
// endregion

// region verify token utility
const verifyToken = (token = '') => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded ?? {};
    } catch (err) {
        return {};
    }
};
// endregion

// region decode token utility
const decodeToken = (token = '') => {
    try {
        const decoded = jwt.decode(token);
        return decoded ?? {};
    } catch (err) {
        return {};
    }
};
// endregion
module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
};
// endregion
