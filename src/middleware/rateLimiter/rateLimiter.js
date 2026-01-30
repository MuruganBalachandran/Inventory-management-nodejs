// region package imports
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit"); // normalizes the client IP address
// so different IPv6 representations of the same user become one single key.
// If you use req.ip directly, attackers can rotate IP formats (not addresses)
//  and bypass your rate limit.
// endregion

// region GLOBAL API LIMITER
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window per IP
  max: 100, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP. Please try again later.",
  },
});
// endregion

// region LOGIN LIMITER (per IP)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    status: "error",
    message: "Too many login attempts. Try again after 10 minutes.",
  },
});

// LOGIN LIMITER (per Email)
const loginLimiterByEmail = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  keyGenerator: (req) => {
    return req.body.Email ? req.body.Email.toLowerCase() : ipKeyGenerator(req);;
  },
  message: {
    status: "error",
    message: "Too many login attempts for this account. Try again later.",
  },
});
// endregion

// region SIGNUP LIMITER (per IP)
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    status: "error",
    message: "Too many accounts created from this IP. Try later.",
  },
});

// SIGNUP LIMITER (per Email)
const signupLimiterByEmail = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  keyGenerator: (req) => {
    return req.body.Email ? req.body.Email.toLowerCase() : ipKeyGenerator(req);;
  },
  message: {
    status: "error",
    message: "Too many registration attempts for this email. Try later.",
  },
});
// endregion

// region exports
module.exports = {
  apiLimiter,
  loginLimiter,
  loginLimiterByEmail,
  signupLimiter,
  signupLimiterByEmail,
};
// endregion
