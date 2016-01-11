import React, {Component} from 'react';
import Eligability from './eligability.jsx';

export default class Form extends Component {
    render() {
        return (
            <div id="form" className="form-container">
                <Eligability />
            </div>
        )
    }
}
