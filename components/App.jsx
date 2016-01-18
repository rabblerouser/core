import React, {Component} from 'react';
import {render} from 'react-dom';
import NewMemberForm from './NewMemberForm.jsx';

export default class App extends Component {
    render() {
        return (
          <div className="container">
            <div id="form" className="form-container">
                <NewMemberForm />
            </div>
          </div>
        )
    }
}

render(<App />, document.getElementById('app'));
