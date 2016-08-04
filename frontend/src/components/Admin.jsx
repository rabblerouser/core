import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../reducers';

import AdminDashboard from './admin/AdminDashboard';
import '../stylesheets/style.scss';

const App = () => (
  <AdminDashboard />
);
const store = createStore(reducer, window.devToolsExtension && window.devToolsExtension());

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'));
