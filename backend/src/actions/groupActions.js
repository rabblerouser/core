const store = require('../store');

const createGroup = group => ({ type: 'CREATE_GROUP', group });
const deleteGroup = group => ({ type: 'DELETE_GROUP', group });
const updateGroup = group => ({ type: 'UPDATE_GROUP', group });

module.exports = store.bindActionCreators({
  createGroup,
  deleteGroup,
  updateGroup,
});
