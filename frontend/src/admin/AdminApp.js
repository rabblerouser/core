import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { ThemeProvider } from 'styled-components';

import { appStarted } from './actions';
import reducer from './reducers';
import AdminDashboard from './AdminDashboard';
import NetworkAdminDashboard from './NetworkAdminDashboard';
import './stylesheets/style.scss';

const theme = {
  primaryColour: '#EA3B49',
};
const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

store.dispatch(appStarted());

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Route path="/dashboard" component={AdminDashboard} />
        <Route path="/dashboard/admin" component={NetworkAdminDashboard} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('app'),
);
