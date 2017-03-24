const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = input => {
  const salt = bcrypt.genSaltSync(config.bcryptRounds);
  return bcrypt.hashSync(input, salt);
};
