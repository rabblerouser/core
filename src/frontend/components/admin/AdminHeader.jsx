'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import adminService from '../../services/adminService.js';
import _ from 'underscore';

const AdminHeader = ({labs, selectedLab, onSelectLab}) => {

    function mapLabOptions() {
        return _.sortBy(labs, 'name').map( lab => (<option key={lab.id} value={lab.id}>{lab.name}</option>));
    };

    let labDescription = onSelectLab ? (<select value={selectedLab.id} onChange={selectLab}>{ mapLabOptions() }</select>)
    : (<span className='currentlab'>{selectedLab.name}</span>)

    function selectLab(event) {
        onSelectLab(event.target.value);
    }

    function logout() {
        adminService.logout();
    }
    return (
        <header className="admin-header header">
            <span>
                <img src ='/images/the_lab_logo.svg'/>
            </span>
            {labDescription}
            <button onClick={logout} className="logout">Logout</button>
        </header>);
};

AdminHeader.propTypes = {
    labs: React.PropTypes.array,
    selectedLab: React.PropTypes.object
};

export default AdminHeader
