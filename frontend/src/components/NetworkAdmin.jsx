import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import sagas from '../sagas/';

import NetworkAdminDashboard from './admin/NetworkAdminDashboard';
import '../stylesheets/style.scss';

const App = () => (
  <NetworkAdminDashboard />
);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas);

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'));
