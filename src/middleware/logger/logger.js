// region package imports
const chalk = require('chalk');
// endregion

// region logger middleware
/**
 * HTTP request logger middleware.
 * Outputs method, URL, status code, and response time with distinct colors.
 */
const logger = (req, res, next) => {
  // mark request start time
  const start = Date.now();

  // res is an event emitter; 'finish' triggers when response is sent
  res.on('finish', () => {
    try {
      // calculate request duration in milliseconds
      const duration = Date.now() - start;

      // region define method colors
      let methodColor;
      const method = req.method ?? 'UNKNOWN';
      switch (method) {
        case 'GET':
          methodColor = chalk?.green?.(method);
          break;
        case 'POST':
          methodColor = chalk?.blue?.(method);
          break;
        case 'PUT':
          methodColor = chalk?.yellow?.(method);
          break;
        case 'PATCH':
          methodColor = chalk?.cyan?.(method);
          break;
        case 'DELETE':
          methodColor = chalk?.red?.(method);
          break;
        default:
          methodColor = chalk?.white?.(method);
      }
      // endregion

      // region define status code color
      let statusColor;
      const statusCode = res.statusCode ?? 0;
      if (statusCode >= 500) {
        statusColor = chalk?.red?.(statusCode);
      } else if (statusCode >= 400) {
        statusColor = chalk?.yellow?.(statusCode);
      } else if (statusCode >= 300) {
        statusColor = chalk?.cyan?.(statusCode);
      } else {
        statusColor = chalk?.green?.(statusCode);
      }
      // endregion

      // region print formatted log
      console?.log?.(
        `[${chalk?.gray?.(new Date().toISOString())}]`, // ISO timestamp
        methodColor ?? method,                                  // HTTP method with color
        chalk?.magenta?.(req.originalUrl || req.url || 'unknown'),               // request path
        statusColor ?? statusCode,                                  // HTTP status color
        chalk?.blue?.(`${duration}ms`)                   // request duration
      );
      // endregion

    } catch (err) {
      // log errors inside logger itself
      console?.error?.(chalk?.red?.('Logger error:'), err?.message ?? 'Unknown logger error');
    }
  });

  // proceed to next middleware/route
  next();
};
// endregion

// region exports
module.exports = logger;
// endregion
