'use strict';
import React from 'react';

export default ({ groups }) => {
    let groupEntries = groups.map( group => (<li key={group.id}>{group.name}</li>));
    return (
        <ul>
            { groupEntries }
        </ul>
    )
}
