'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
export default ({ groups , onSelect}) => {
    let groupEntries = groups.map( group => (<GroupListEntry key={group.id} group={group} onSelect={onSelect} />));

    function selectAll() {
        onSelect();
    }

    function selectGroup(event) {
        onSelect(event.target.value);
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
