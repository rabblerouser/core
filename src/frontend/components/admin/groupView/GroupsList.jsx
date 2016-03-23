'use strict';
import React from 'react';
import _ from 'underscore';
export default ({ groups , onSelect}) => {

    let groupEntries = _.sortBy(groups, 'name').map( group => (<option key={group.id} value={group.id}>{ group.name }</option>));

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
                   <option value='unassigned'>Unassigned</option>
                    { groupEntries }
                    <option value='all'>All participants</option>
                </select>
            </div>
    )
}
