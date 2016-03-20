'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx'
import DeleteGroupButton from './DeleteGroupButton.jsx'

export default ({ onSave, onDelete, group }) => (
    <header>
        <span className="title">{ group.name }</span>
        <span className="actions">
            <EditGroupModalLauncher onSave={ onSave } group={ group }/>
            <DeleteGroupButton onDelete={ onDelete } group={ group }/>
        </span>
    </header>
)
