// region imports
const mongoose = require("mongoose");
const chalk = require("chalk");
const { env } = require('../env/envConfig'); // import validated environment variables
// endregion

// region connect to db
const connectDB = async () => {
  try {
    // connect using MongoDB URL from env config
    await mongoose.connect(env.MONGODB_URL);

    // log successful connection
    console.log(chalk.green("MongoDB Connected Successfully"));

  } catch (error) {
    // log failure reason for debugging
    console.error(chalk.red("MongoDB Connection Failed:"), error.message);

    // exit process because app cannot run without DB
    process.exit(1);
  }
};
// endregion

// region connection events

// log when MongoDB connection drops (network issue, server down, etc.)
mongoose.connection.on('disconnected', () => {
  console.warn(chalk.yellow('MongoDB Disconnected'));
});

// log when MongoDB reconnects automatically
mongoose.connection.on('reconnected', () => {
  console.log(chalk.cyan('MongoDB Reconnected'));
});

// log low-level Mongo errors
mongoose.connection.on('error', (err) => {
  console.error(chalk.red('MongoDB Runtime Error:'), err.message);
});

// endregion

// region exports
module.exports = connectDB;
// endregion
