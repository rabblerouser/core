'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';

export default ({ group, onSave, onSelect }) => {

    function selectGroup() {
        onSelect(group);
    }

    return (  <li onClick={selectGroup} className={group.selected ? 'selected' : ''}>
        <span>{ group.name }</span>
    </li>)
}
