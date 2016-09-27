import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './signup/reducers';
import sagas from './signup/sagas';

import SignupPage from './signup/components/SignupPage';
import { branchListRequested } from './signup/actions';

import '../stylesheets/style.scss';

const App = () => (
  <div className="container">
    <div id="form" className="form-container">
      <SignupPage />
    </div>
  </div>
);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(sagas);
store.dispatch(branchListRequested());

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'));
