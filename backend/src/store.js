const redux = require('redux');
const rootReducer = require('./reducers/rootReducer').reducer;

const store = redux.createStore(rootReducer);

// This function has two purposes:
// 1: Bind the action creator function to the store instance, so you can just
//    call the action creator, rather than having to dispatch the action explicitly
// 2: Make the action creator function return a promise, because that's what the
//    rr-stream-client is expecting to be returned by event handler functions.
const bindActionCreator = actionCreator => (...params) => {
  try {
    store.dispatch(actionCreator(...params));
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

const bindActionCreators = actionCreators => {
  const result = {};
  Object.keys(actionCreators).forEach(actionKey => {
    result[actionKey] = bindActionCreator(actionCreators[actionKey]);
  });
  return result;
};

module.exports = {
  bindActionCreators,
  getState: store.getState,
};
