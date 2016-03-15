'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';
export default ({ groups , selectedGroup, editable, onSave, onSelectGroup}) => {

    let groupEntries = groups.map( group => (<GroupListEntry key={group.id} group={group} onSave={onSave} onSelect={onSelectGroup} />));
    let addModalLauncher = editable ? <li className="new"><AddGroupModalLauncher onSave={onSave} /></li> : null;

    function selectAll() {
        onSelectGroup();
    }

    function selectGroup(event) {
        console.log(event.target.value);
        onSelectGroup(event.target.value);
    }

    return (
        <div className="select">
        <span className="arr"></span>
        <select defaultValue="All participants" onChange={selectGroup}>
       
        	<option value=''>All participants</option>
            { groupEntries }
          
        </select>
        </div>
    )
}
