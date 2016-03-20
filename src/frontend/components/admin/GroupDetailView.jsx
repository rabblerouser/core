'use strict';
import React from 'react';
import GroupHeader from './GroupHeader.jsx';
import GroupDetails from './GroupDetails.jsx';

export default ({ selectedGroup, onSave, onDelete }) => (
    <section className="group-details">
        <GroupHeader onSave={ onSave } onDelete={ onDelete } group={ selectedGroup }/>
        <GroupDetails group={ selectedGroup }/>
    </section>
)
