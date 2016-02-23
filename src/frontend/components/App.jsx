import React, {Component} from 'react';
import {render} from 'react-dom';
import NewMemberForm from './NewMemberForm.jsx';
import { Resources } from '../config/strings';

export default class App extends Component {
    render() {
        return (
          <div className="container">
            <div id="form" className="form-container">
                <NewMemberForm />
            </div>
            <div className="footer">
                <a href={ Resources.privacyPolicy } target="_blank">Privacy Policy</a>
            </div>
          </div>
        )
    }
}

render(<App />, document.getElementById('app'));
