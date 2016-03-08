import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import adminService from '../../services/adminService.js';

export default class AdminHeader extends Component {
    constructor(props) {
        super(props);
    }

    logout() {
        adminService.logout();
    }

    render() {
        return (
            <div className="header">
                <button onClick={this.logout}>Logout</button>
                <img src ='/images/the_lab_logo.svg'/>
            </div>);
    }
}