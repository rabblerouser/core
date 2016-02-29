import React, {Component} from 'react';
import {render} from 'react-dom';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }

    render() {

        let data = [
            {
                name: 'React.js'
            },
            {
                name: 'Angular.js'
            },
            {
                name: 'Aurelia'
            }
        ];

        let columns = [
            {
                property: 'name',
                header: 'Name'
            }
        ];

        let Table = require('reactabular').Table;

        return (
            <div className="admin-container">
                <div className="container">
                    <Table columns={columns} data={data} />
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));