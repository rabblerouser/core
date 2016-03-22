'use strict';
import React from 'react';
import EditLabModalLauncher from './EditLabModalLauncher.jsx';
import AddLabModalLauncher from './AddLabModalLauncher.jsx';
import DeleteLabButton from './DeleteLabButton.jsx';

export default ({ onSave, onDelete, lab }) => (
    <span className="actions">
        <AddLabModalLauncher onSave={ onSave } />
        <EditLabModalLauncher onSave={ onSave } lab={ lab }/>
        <DeleteLabButton onDelete={ onDelete } lab={ lab }/>
    </span>
)
