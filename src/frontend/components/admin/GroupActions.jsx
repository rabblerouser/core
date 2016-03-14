'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx'
import DeleteGroupButton from './DeleteGroupButton.jsx'

export default ({ onSave, onDelete, group }) => (
    <span>
        <EditGroupModalLauncher onSave={ onSave } group={ group }/>
        <DeleteGroupButton onDelete={ onDelete } group={ group }/>
    </span>
)
