// region imports
const { findSuperAdmin, createInitialSuperAdmin } = require('../../queries/user/userQueries');
const { env } = require('../../config/env/envConfig');
const chalk = require('chalk');
// endregion

// region super admin initialization
/**
 * Initializes the Super Admin user if it doesn't already exist in the database.
 * Credentials are pulled from the sanitized environment configuration.
 */
const initSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await findSuperAdmin();
    
    if (existingSuperAdmin) {
      console.log(chalk?.blue?.('Super Admin already exists. Startup sequence continues...'));
      return;
    }

    const email = env?.SUPER_ADMIN_EMAIL;
    const password = env?.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      console?.warn?.(chalk?.yellow?.('WARNING: SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set. Skipping automatic Super Admin creation.'));
      return;
    }

    await createInitialSuperAdmin(email, password);
    console?.log?.(chalk?.green?.('Super Admin initialized successfully from environment configuration.'));
    
  } catch (err) {
    console?.error?.(chalk?.red?.('CRITICAL ERROR: Failed to initialize Super Admin:'), err?.message ?? 'Unknown error');
  }
};
// endregion

// region exports
module.exports = initSuperAdmin;
// endregion
