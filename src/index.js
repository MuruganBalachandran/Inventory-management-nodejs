// region imports
const app = require("./app");
<<<<<<< HEAD
const chalk = require("chalk");
=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// endregion

// region config
const port = process.env.PORT ;
// endregion

// region server
app.listen(port, () => {
<<<<<<< HEAD
 console.log(chalk.green(`Server is up on port ${port}`));
=======
  console.log(`Server is up on port ${port}`);
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
});
// endregion