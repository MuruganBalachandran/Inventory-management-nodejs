// region imports
const mongoose = require("mongoose");
<<<<<<< HEAD
const chalk = require("chalk");
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
<<<<<<< HEAD
    console.log(chalk.green("Connected to MongoDB"));
  } catch (error) {
    console.error(chalk.red("Error connecting to MongoDB:"), error);
=======
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
    process.exit(1);
  }
};
// endregion

// region function call
connectDB();
<<<<<<< HEAD
// endregion
=======
// endregiomn
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
