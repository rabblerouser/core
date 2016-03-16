import React, {Component} from 'react';
import {render} from 'react-dom';
import NewMemberForm from './NewMemberForm.jsx';
import { Resources } from '../config/strings';

const App = () => (
  <div className="container">
    <div id="form" className="form-container">
      <NewMemberForm />
    </div>
  </div>
);

render(<App />, document.getElementById('app'));
