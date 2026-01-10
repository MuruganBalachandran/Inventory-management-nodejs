// region imports
const app = require("./app");
// endregion

// region config
const port = process.env.PORT ;
// endregion

// region server
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
// endregion