import React from 'react';
import { connect } from 'react-redux';

import { getGroups } from './reducers';

export const GroupsList = ({ groups, onSelect }) => {
  const selectGroup = e => onSelect(e.target.value);

  return (
    <div className="select">
      <span className="arr" />
      <select id="groups" defaultValue="All members" onChange={selectGroup}>
        <option value="unassigned">Unassigned</option>
        {
          groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)
        }
        <option value="all">All members</option>
      </select>
    </div>
  );
};

const orderByName = ({ name: a }, { name: b }) => a.localeCompare(b);

const mapStateToProps = state => ({
  groups: getGroups(state).sort(orderByName),
});

GroupsList.propTypes = {
  groups: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(GroupsList);
