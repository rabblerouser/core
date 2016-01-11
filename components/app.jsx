import React, {Component} from 'react';
import {render} from 'react-dom';
import Form from './form.jsx';

export default class App extends Component {
    render() {
        return (
            <Form />
        )
    }
}

render(<App />, document.getElementById('app'));
