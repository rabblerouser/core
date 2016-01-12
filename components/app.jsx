import React, {Component} from 'react';
import {render} from 'react-dom';
import Form from './form.jsx';

export default class App extends Component {
    render() {
        return (
            <div id="form" className="form-container">
                <Form />
            </div>
        )
    }
}

render(<App />, document.getElementById('app'));
