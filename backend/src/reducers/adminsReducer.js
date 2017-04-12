const initialState = [];

const admins = (state = initialState, action) => {
  switch (action.type) {

    case 'CREATE_ADMIN':
      return state.concat(action.admin);

    case 'DELETE_ADMIN':
      return state.filter(admin => admin.id !== action.admin.id);

    case 'UPDATE_ADMIN': {
      return state.map(admin => (
        admin.id === action.admin.id ?
          Object.assign({}, admin, action.admin) :
          admin
      ));
    }

    default:
      return state;
  }
};

module.exports = admins;
