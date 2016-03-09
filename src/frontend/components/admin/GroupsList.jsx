'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';
export default ({ groups , selectedGroup, editable, onSave, onSelectGroup}) => {

    let groupEntries = groups.map( group => (<GroupListEntry group={group} onSave={onSave} onSelect={onSelectGroup} />));
    let addModalLauncher = editable ? <li className="new"><AddGroupModalLauncher onSave={onSave} /></li> : null;

    function selectAll() {
        onSelectGroup('');
    }

    return (
        <ul>
        	<li onClick={selectAll} className={selectedGroup ? '' : 'selected'}>All participants</li>
            { groupEntries }
            { addModalLauncher }
        </ul>
    )
}
