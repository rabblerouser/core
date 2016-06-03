import React from 'react';
import _ from 'underscore';

export default ({ groups, onSelect }) => {
  const groupEntries = _.sortBy(groups, 'name').map(group => (
    <option key={group.id} value={group.id}>{group.name}</option>));

  function selectGroup(event) {
    onSelect(event.target.value);
  }

  return (
    <div className="select">
      <span className="arr"></span>
      <select id="groups" defaultValue="All participants" onChange={selectGroup}>
        <option value="unassigned">Unassigned</option>
        {groupEntries}
        <option value="all">All participants</option>
      </select>
    </div>
  );
};
