'use strict';
import React from 'react';
import GroupHeader from './GroupHeader.jsx';
import GroupDetails from './GroupDetails.jsx';

export default ({ selectedGroup, onSave, onDelete }) => (
    <section className="admin-section" id="description">
        <GroupDetails group={ selectedGroup }/>
        <GroupHeader onSave={ onSave } onDelete={ onDelete } group={ selectedGroup }/>
        
    </section>
)
