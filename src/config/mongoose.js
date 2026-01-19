// region imports
const mongoose = require("mongoose");
const chalk = require("chalk");

// endregion

// region connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(chalk.green("Connected to MongoDB"));
  
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
// endregion

// region function call
connectDB();
// endregion
