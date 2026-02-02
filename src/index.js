// region imports
// package imports
const chalk = require('chalk');

// config imports
const connectDB = require('./config/mongoose/mongoose');
const { env } = require('./config/env/envConfig');

// app imports
const app = require('./app');
const initSuperAdmin = require('./utils/startup/superAdminInit');
// endregion

// region start server
/**
 * Boots the application by connecting to DB and starting the HTTP listener.
 */
const startServer = async () => {
  try {
    // wait for DB connection before starting server
    await connectDB?.();

    // initialize super admin if needed
    await initSuperAdmin();

    // start express server only after DB is ready
    app?.listen?.(env?.PORT ?? 3000, () => {
      console?.log?.(chalk?.green?.(`Server running on port ${env?.PORT ?? 3000}`));
    });

  } catch (err) {
    // log startup error and exit
    console?.error?.(chalk?.red?.('Server startup failed:'), err?.message ?? 'Unknown startup error');
    process?.exit?.(1);
  }
};

startServer();
// endregion
