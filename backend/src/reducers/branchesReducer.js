const initialState = [];

const branches = (state = initialState, action) => {
  switch (action.type) {

    case 'CREATE_BRANCH':
      return state.concat(action.branch);

    case 'DELETE_BRANCH':
      return state.filter(branch => branch.id !== action.branch.id);

    case 'UPDATE_BRANCH': {
      return state.map(branch => (
        branch.id === action.branch.id ?
          Object.assign({}, branch, action.branch) :
          branch
      ));
    }

    default:
      return state;
  }
};

module.exports = {
  reducer: branches,
};
