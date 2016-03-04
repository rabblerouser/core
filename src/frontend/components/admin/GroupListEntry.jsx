'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';

export default ({ group, onSave }) => (
  <li>
      <span>{ group.name }</span>
      <EditGroupModalLauncher group={group} onSave={onSave}/>
  </li>
)
