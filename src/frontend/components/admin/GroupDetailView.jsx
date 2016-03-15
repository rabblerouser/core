'use strict';
import React from 'react';
import GroupActions from './GroupActions.jsx';
import GroupDetails from './GroupDetails.jsx';

export default ({ selectedGroup, onSave, onDelete }) => (
    <section className="groupDetails">
        
        <GroupDetails group={ selectedGroup }/>
        <GroupActions onSave={ onSave } onDelete={ onDelete } group={ selectedGroup }/>
    </section>
)
