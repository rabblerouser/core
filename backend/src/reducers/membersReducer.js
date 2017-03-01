const initialState = [];

const members = (state = initialState, action) => {
  switch (action.type) {

    case 'CREATE_MEMBER': {
      const newMember = Object.assign({},
        action.member,
        { groups: [] },
      {});
      return state.concat(newMember);
    }

    case 'DELETE_MEMBER':
      return state.filter(member => member.id !== action.member.id);

    case 'UPDATE_MEMBER': {
      return state.map(member => (
        member.id === action.member.id ?
          Object.assign({}, member, action.member) :
          member
      ));
    }

    default:
      return state;
  }
};

module.exports = {
  reducer: members,
};
