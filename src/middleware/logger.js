// region package imports
const chalk = require('chalk');
// endregion

// region logger middleware
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    try {
      const duration = Date.now() - start;

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

      // Apply color based on HTTP status code
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

      console.log(
        `[${chalk.gray(new Date().toISOString())}]`,
        methodColor,
        chalk.magenta(req.originalUrl),
        statusColor,
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
