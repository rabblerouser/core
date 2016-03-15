'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';
export default ({ groups , selectedGroup, editable, onSave, onSelectGroup}) => {

    let groupEntries = groups.map( group => (<GroupListEntry key={group.id} group={group} onSave={onSave} onSelect={onSelectGroup} />));
    let addModalLauncher = <p className="new"><AddGroupModalLauncher onSave={onSave} /></p>

    function selectAll() {
        onSelectGroup();
    }

    function selectGroup(event) {
        onSelectGroup(event.target.value);
    }

    return (
        <div>
            <div className="select">
                        <span className="arr"></span>
                        <select defaultValue="All participants" onChange={selectGroup}>
                           <option value=''>All participants</option>
                            { groupEntries }
                        </select>
            </div>
            {addModalLauncher}
        </div>
        
    )
}
