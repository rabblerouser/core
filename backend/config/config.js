// This file is for sequelize. This is the default file path/name it looks for.
module.exports = {
  development: { use_env_variable: 'DATABASE_URL', logging: false },
  test: { use_env_variable: 'TEST_DATABASE_URL', logging: false },
  production: { use_env_variable: 'DATABASE_URL' },
};
