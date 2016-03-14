'use strict';
import React from 'react';

export default ({ onDelete, group }) => {

    var deleteGroup = () => {
        onDelete(group);
    };
    return (<button onClick={deleteGroup}>Delete</button>)
}
