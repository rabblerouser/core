'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';
export default ({ groups , editable, onSave, onSelectGroup}) => {

    let groupEntries = groups.map( group => (<GroupListEntry group={group} onSave={onSave} onSelect={onSelectGroup} />));
    let addModalLauncher = editable ? <li className="new"><AddGroupModalLauncher onSave={onSave} /></li> : null;

    return (
        <ul>
        	<li className="selected">All participants</li>
            { groupEntries }
            { addModalLauncher }
        </ul>
    )
}
