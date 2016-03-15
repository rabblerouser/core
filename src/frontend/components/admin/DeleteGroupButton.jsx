'use strict';
import React from 'react';

export default ({ onDelete, group }) => {

    var deleteGroup = () => {
        onDelete(group);
    };
    return (<button onClick={deleteGroup} className="deleteGroup" title="Delete group"><span>Delete group</span></button>)
}
