import React from 'react';
import { connect } from 'react-redux';

import { getGroups, getSelectedGroupId } from './reducers';

const orderByName = ({ name: a }, { name: b }) => a.localeCompare(b);

export const GroupsList = ({ groups, selected, onSelect }) => {
  const selectGroup = e => onSelect(e.target.value);

  return (
    <div className="select">
      <span className="arr" />
      <select id="groups" value={selected} onChange={selectGroup}>
        <option value="unassigned">Unassigned</option>
        {
          groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)
        }
        <option value="all">All members</option>
      </select>
    </div>
  );
};

const mapStateToProps = state => ({
  groups: getGroups(state).sort(orderByName),
  selected: getSelectedGroupId(state),
});

GroupsList.propTypes = {
  selected: React.PropTypes.string.isRequired,
  groups: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(GroupsList);
