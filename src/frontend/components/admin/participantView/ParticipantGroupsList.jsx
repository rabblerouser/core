import React from 'react';

export default ({ groups }) => (
  <ul>
    {groups.map(group => <li key={group.id}>{group.name}</li>)}
  </ul>
);
