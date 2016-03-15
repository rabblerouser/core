'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';

export default ({ group, onSelect }) => {
    return (  <option value={group.id}>
        { group.name }
    </option>)
}
