const initialState = [];

const groups = (state = initialState, action) => {
  switch (action.type) {

    case 'CREATE_GROUP': {
      return state.concat(action.group);
    }

    case 'DELETE_GROUP':
      return state.filter(group => group.id !== action.group.id);

    case 'UPDATE_GROUP': {
      return state.map(group => (
        group.id === action.group.id ?
          Object.assign({}, group, action.group) :
          group
      ));
    }

    default:
      return state;
  }
};

module.exports = groups;
