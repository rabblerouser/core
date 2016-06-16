import React from 'react';
import { render } from 'react-dom';
import NewMemberForm from './NewMemberForm.jsx';
import '../stylesheets/style.scss';

const App = () => (
  <div className="container">
    <div id="form" className="form-container">
      <NewMemberForm />
    </div>
  </div>
);

render(<App />, document.getElementById('app'));
