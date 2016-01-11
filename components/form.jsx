import React, {Component} from 'react';
import Eligibility from './eligibility.jsx';

export default class Form extends Component {
    render() {
        return (
            <div id="form" className="form-container">
                <Eligibility />
            </div>
        )
    }
}
