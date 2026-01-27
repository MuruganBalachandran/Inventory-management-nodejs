// region package imports
const bcryptjs = require('bcryptjs');
// endregion

// region hash password utility
const hashPassword = async (password = '') => {
    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        return hashedPassword ?? '';
    } catch (err) {
        return '';
    }
};
// endregion

// region verify password utility
const verifyPassword = async (plainPassword = '', hashedPassword = '') => {
    try {
        const isMatch = await bcryptjs.compare(plainPassword, hashedPassword);
        return isMatch ?? false;
    } catch (err) {
        return false;
    }
};

// region exports
module.exports = {
    hashPassword,
    verifyPassword,
};
// endregion
