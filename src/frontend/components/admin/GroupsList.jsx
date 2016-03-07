'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';
export default ({ groups , editable, onSave }) => {

    let groupEntries = groups.map( group => (<GroupListEntry group={group} onSave={onSave} />));
    let addModalLauncher = editable ? <li><AddGroupModalLauncher onSave={onSave} /></li> : null;

    return (
        <ul>
            { groupEntries }
            { addModalLauncher }
        </ul>
    )
}
