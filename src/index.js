// region package imports
const chalk = require('chalk');
const connectDB = require('./config/mongoose');
// endregion

// region app imports
const app = require('./app');
// endregion

// region environment config
const port = process.env.PORT || 3000;
// endregion

// region start server
try {
    connectDB();
    app.listen(port, () => {
        console.log(chalk.green(`✓ Server is running on port ${port}`));
    });
} catch (err) {
    console.log("error : ", err);
}

// endregion