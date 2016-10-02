import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import sagas from './sagas/';

import AdminDashboard from './components/AdminDashboard';
import NetworkAdminDashboard from './components/NetworkAdminDashboard';
import './stylesheets/style.scss';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/dashboard/admin" component={NetworkAdminDashboard} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
