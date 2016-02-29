import React, {Component} from 'react';
import {render} from 'react-dom';
import Secretary from './Secretary.jsx';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }


    render() {
            return (
                <div className="admin-container">
                    <div className="container">
                        <Secretary />
                    </div>
                </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));