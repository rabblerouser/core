'use strict';
import React from 'react';
import GroupListEntry from './GroupListEntry.jsx';

export default ({ groups }) => {
    let groupEntries = groups.map( group => (<GroupListEntry name={group.name} />));
    return (
        <ul>
            { groupEntries }
        </ul>
    )
}
