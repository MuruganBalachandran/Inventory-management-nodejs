// region package imports
const chalk = require('chalk');
// endregion

// region logger middleware
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
      switch (req.method) {
        case 'GET':
          methodColor = chalk.green(req.method);
          break;
        case 'POST':
          methodColor = chalk.blue(req.method);
          break;
        case 'PUT':
          methodColor = chalk.yellow(req.method);
          break;
        case 'PATCH':
          methodColor = chalk.cyan(req.method);
          break;
        case 'DELETE':
          methodColor = chalk.red(req.method);
          break;
        default:
          methodColor = chalk.white(req.method);
      }
      // endregion

      // region define status code color
      let statusColor;
      if (res.statusCode >= 500) {
        statusColor = chalk.red(res.statusCode);
      } else if (res.statusCode >= 400) {
        statusColor = chalk.yellow(res.statusCode);
      } else if (res.statusCode >= 300) {
        statusColor = chalk.cyan(res.statusCode);
      } else {
        statusColor = chalk.green(res.statusCode);
      }
      // endregion

      // region print formatted log
      console.log(
        `[${chalk.gray(new Date().toISOString())}]`, // ISO timestamp
        methodColor,                                  // HTTP method with color
        chalk.magenta(req.originalUrl),               // request path
        statusColor,                                  // HTTP status color
        chalk.blue(`${duration}ms`)                   // request duration
      );
      // endregion

    } catch (err) {
      // log errors inside logger itself
      console.error(chalk.red('Logger error:'), err?.message ?? 'Unknown logger error');
    }
  });

  // proceed to next middleware/route
  next();
};
// endregion

// region exports
module.exports = logger;
// endregion
