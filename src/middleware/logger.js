// region imports
const chalk = require("chalk");
// endregion

// region logger function
const func = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    try {
      const duration = Date.now() - start;

      // Color HTTP methods
      let methodColor;
      switch (req.method) {
        case "GET":
          methodColor = chalk.green(req.method);
          break;
        case "POST":
          methodColor = chalk.blue(req.method);
          break;
        case "PUT":
          methodColor = chalk.yellow(req.method);
          break;
        case "DELETE":
          methodColor = chalk.red(req.method);
          break;
        default:
          methodColor = chalk.white(req.method);
      }

      // Color status code
      let statusColor;
      if (res.statusCode >= 500) statusColor = chalk.red(res.statusCode);
      else if (res.statusCode >= 400) statusColor = chalk.yellow(res.statusCode);
      else if (res.statusCode >= 300) statusColor = chalk.cyan(res.statusCode);
      else statusColor = chalk.green(res.statusCode);

      // Print log
      console.log(
        `[${chalk.gray(new Date().toISOString())}]`,
        methodColor,
        chalk.magenta(req.originalUrl),
        statusColor,
        chalk.blue(`${duration}ms`)
      );
    } catch (err) {
      // Never crash app because of logger
      console.error("Logger error:", err);
    }
  });

  next();
};
// endregion

// region exports
module.exports = func;
// endregion
