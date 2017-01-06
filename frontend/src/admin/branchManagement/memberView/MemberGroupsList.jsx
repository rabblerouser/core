import React from 'react';

const MemberGroupsList = ({ groups }) => (
  <ul>
    {groups.map(group => <li key={group.id}>{group.name}</li>)}
  </ul>
);

export default MemberGroupsList;
