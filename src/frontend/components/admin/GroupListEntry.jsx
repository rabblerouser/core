'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';

export default ({ group, onSelect }) => {

    // function selectGroup() {
    //     console.log(
    //     	'dskjdsljkdslkj')
    //     onSelect(group);
    // }

    return (  <option value={group.id}>
        { group.name }
    </option>)
}
