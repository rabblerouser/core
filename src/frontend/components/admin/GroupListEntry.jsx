'use strict';
import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';

export default ({ group, onSave }) => (
  <li>
      <div>{ group.name }</div>
      <div><EditGroupModalLauncher group={group} onSave={onSave}/></div>
  </li>
)
