'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';

export default ({ group, onSave, onSelect }) => {

    function selectGroup() {
        onSelect(group.id);
    }


    return (  <li onClick={selectGroup}>
        <span>{ group.name }</span>
    </li>)
}
