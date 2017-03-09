const initialState = [];

const members = (state = initialState, action) => {
  switch (action.type) {

    case 'CREATE_MEMBER': {
      const newMember = Object.assign({},
        action.member,
        { groups: [] }
      );
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

    case 'DELETE_GROUP': {
      const deletedGroup = action.group.id;

      return state.map(member => {
        const existingGroups = member.groups;
        if (!existingGroups.includes(deletedGroup)) {
          return member;
        }

        const groupsWithoutDeletedGroup = existingGroups.reduce((result, existingGroup) => (
          existingGroup === deletedGroup ? result : result.concat(existingGroup)
        ), []);

        return Object.assign({}, member, {
          groups: groupsWithoutDeletedGroup,
        });
      });
    }

    default:
      return state;
  }
};

module.exports = {
  reducer: members,
};
