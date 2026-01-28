// region package imports
const chalk = require('chalk');
const connectDB = require('./config/mongoose');
// endregion

// region config imports
const { env } = require('./config');
// endregion

// region app imports
const app = require('./app');
// endregion

// region start server
try {
    connectDB();
    app.listen(env.PORT, () => {
        console.log(chalk.green(`✓ Server is running on port ${env.PORT}`));
    });
} catch (err) {
    console.log("error : ", err);
}

// endregion