'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx'
import DeleteGroupButton from './DeleteGroupButton.jsx'

export default ({ onSave, onDelete, group }) => (
    <div className="buttons">
        <EditGroupModalLauncher onSave={ onSave } group={ group }/>
        <DeleteGroupButton onDelete={ onDelete } group={ group }/>
    </div>
)
