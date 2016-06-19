import React from 'react';
import _ from 'underscore';

const GroupsList = ({ groups, onSelect }) => {
  const groupEntries = _.sortBy(groups, 'name').map(group => (
    <option key={group.id} value={group.id}>{group.name}</option>));

  function selectGroup(event) {
    onSelect(event.target.value);
  }

  return (
    <div className="select">
      <span className="arr"></span>
      <select id="groups" defaultValue="All members" onChange={selectGroup}>
        <option value="unassigned">Unassigned</option>
        {groupEntries}
        <option value="all">All members</option>
      </select>
    </div>
  );
};

GroupsList.propTypes = {
  groups: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func.isRequired,
};

export default GroupsList;
