// region package imports
const rateLimit = require('express-rate-limit');
// endregion

// region general API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  standardHeaders: true, // This enables the modern, standardized headers:
  legacyHeaders: false, // This disables the old Express rate-limit headers
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
});
// endregion

// region login limiter (strict)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // only 5 login attempts
  message: {
    status: 'error',
    message: 'Too many login attempts. Try again later.',
  },
});
// endregion

module.exports = {
  apiLimiter,
  loginLimiter,
};
