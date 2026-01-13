// region imports
const app = require("./app");
const chalk = require("chalk");
// endregion

// region config
const port = process.env.PORT ;
// endregion

// region server
app.listen(port, () => {
 console.log(chalk.green(`Server is up on port ${port}`));
});
// endregion