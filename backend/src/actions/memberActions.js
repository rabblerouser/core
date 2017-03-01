const store = require('../store');

const createMember = member => ({ type: 'CREATE_MEMBER', member });
const deleteMember = member => ({ type: 'DELETE_MEMBER', member });
const updateMember = member => ({ type: 'UPDATE_MEMBER', member });

module.exports = store.bindActionCreators({
  createMember,
  deleteMember,
  updateMember,
});
