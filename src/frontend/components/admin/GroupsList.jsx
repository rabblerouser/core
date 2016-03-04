'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';
export default ({ groups , onSave }) => {

    let groupEntries = groups.map( group => (<GroupListEntry group={group} onSave={onSave} />));
    return (
        <ul>
            { groupEntries }
            <li>
                <AddGroupModalLauncher onSave={onSave}/>
            </li>
        </ul>
    )
}
