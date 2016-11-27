import React from 'react';

const MemberGroupsList = ({ groups }) => (
  <ul>
    {groups.map(group => <li key={group.id}>{group.name}</li>)}
  </ul>
);

MemberGroupsList.propTypes = {
  groups: React.PropTypes.array.isRequired,
};

export default MemberGroupsList;
