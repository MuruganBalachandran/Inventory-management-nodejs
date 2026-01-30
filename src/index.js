// region imports
// package imports
const chalk = require('chalk');

// config imports
const connectDB = require('./config/mongoose/mongoose');
const { env } = require('./config/env/envConfig');

// app imports
const app = require('./app');
// endregion

// region start server
const startServer = async () => {
  try {
    // wait for DB connection before starting server
    await connectDB();

    // start express server only after DB is ready
    app.listen(env.PORT, () => {
      console.log(chalk.green(`Server running on port ${env.PORT}`));
    });

  } catch (err) {
    // log startup error and exit
    console.error(chalk.red('Server startup failed:'), err.message);
    process.exit(1);
  }
};

startServer();
// endregion
