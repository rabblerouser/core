'use strict';
import React from 'react';
import GroupActions from './GroupActions.jsx';
import GroupDetails from './GroupDetails.jsx';

export default ({ selectedGroup, onSave, onDelete }) => (
    <div>
        <GroupActions onSave={ onSave } onDelete={ onDelete } group={ selectedGroup }/>
        <GroupDetails group={ selectedGroup }/>
    </div>
)
