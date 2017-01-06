import React from 'react';
import { connect } from 'react-redux';

import { getGroups, getSelectedGroupId } from './reducers';
import { groupSelected } from './actions';

const orderByName = ({ name: a }, { name: b }) => a.localeCompare(b);

export const GroupSelect = ({ groups, selected, onSelect }) => {
  const selectGroup = e => onSelect(e.target.value);

  return (
    <select id="groups" value={selected} onChange={selectGroup}>
      <option value="unassigned">Unassigned</option>
      {
        groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)
      }
      <option value="all">All members</option>
    </select>
  );
};

const mapStateToProps = state => ({
  groups: getGroups(state).sort(orderByName),
  selected: getSelectedGroupId(state),
});

export default connect(mapStateToProps, { onSelect: groupSelected })(GroupSelect);
