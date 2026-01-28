// region imports
const mongoose = require("mongoose");
const chalk = require("chalk");
const { env } = require('../config');
// endregion

// region connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URL);
    console.log(chalk.green("Connected to MongoDB"));
  } catch (error) {
    console.error(chalk.red("Error connecting to MongoDB:"), error);
    process.exit(1);
  }
};
// endregion

// region function call
module.exports = connectDB;
// endregion
