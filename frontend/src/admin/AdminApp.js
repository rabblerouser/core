import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { ThemeProvider } from 'styled-components';
import Cookies from 'js-cookie';

import { appStarted } from './actions';
import reducer from './reducers';
import AdminDashboard from './AdminDashboard';
import './stylesheets/style.scss';

const user = Cookies.getJSON('user');
const theme = {
  primaryLight: '#F67E88',
  primaryColour: '#EA3B49',
  primaryDark: '#5B3332',
  lightGrey: '#EFEFEF',
  darkGrey: '#8D8D8D',
  white: '#fff',
  black: '#000',
  success: '#368C1E',
  error: '#EF0000',
};
const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

store.dispatch(appStarted(user));

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Route path="/dashboard" component={AdminDashboard} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('app'),
);
