import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { appStarted } from './actions';
import reducer from './reducers';
import AdminDashboard from './components/AdminDashboard';
import NetworkAdminDashboard from './components/NetworkAdminDashboard';
import './stylesheets/style.scss';

const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);

store.dispatch(appStarted());

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/dashboard/admin" component={NetworkAdminDashboard} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
