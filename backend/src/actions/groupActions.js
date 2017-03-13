const store = require('../store');

const deleteGroup = group => ({ type: 'DELETE_GROUP', group });

module.exports = store.bindActionCreators({
  deleteGroup,
});
