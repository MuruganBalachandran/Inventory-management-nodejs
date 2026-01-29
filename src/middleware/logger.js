// region package imports
const chalk = require('chalk');
// endregion

// region logger middleware
const logger = (req, res, next) => {
  const start = Date.now();

  // res (response object) is an event emitter in Node.js.
  // .on(event, callback) - Run this function when that event happens.
  res.on('finish', () => {
    try {
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
          break;
      }

      // region Apply color based on HTTP status code
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

      // region print the log
      console.log(
        `[${chalk.gray(new Date().toISOString())}]`,
         // Converts current server time into standard format
        methodColor, // color of a method
        chalk.magenta(req.originalUrl),
        statusColor, // color of duration minutes
        chalk.blue(`${duration}ms`)
      );
    } catch (err) {
      console.error(chalk.red('Logger error:'), err?.message);
    }
  });

  next();
};
// endregion

// region exports
module.exports = logger;
// endregion
