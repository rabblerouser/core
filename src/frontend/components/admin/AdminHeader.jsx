'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import adminService from '../../services/adminService.js';

const AdminHeader = ({labs, selectedLab, onSelectLab}) => {
    let labEntries = labs.map( lab => (<option key={lab.id} value={lab.id}>{lab.name}</option>));

    function selectLab(event) {
        onSelectLab(event.target.value);
    }

    function logout() {
        adminService.logout();
    }
    return (
        <header className="admin-header header">
            <span className='admin-actions'>
                <select defaultValue={selectedLab.id} onChange={''}>
                   { labEntries }
                </select>
                <button onClick={logout} className="logout">Logout</button>
            </span>
            <span>
                <img src ='/images/the_lab_logo.svg'/>
            </span>
        </header>);
};

AdminHeader.propTypes = {
    labs: React.PropTypes.array,
    selectedLab: React.PropTypes.object
};

export default AdminHeader
