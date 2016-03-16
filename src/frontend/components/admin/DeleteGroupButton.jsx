'use strict';
import React from 'react';

export default ({ onDelete, group }) => {

    var deleteGroup = () => {
        if(confirm('Are you sure you want to delete the current group?')){
            onDelete(group);
        }
    };
    
    return (<button onClick={deleteGroup} className="deleteGroup" title="Delete group"><span>Delete group</span></button>)
}
