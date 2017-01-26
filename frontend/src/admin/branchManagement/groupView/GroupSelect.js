import React from 'react';
import { connect } from 'react-redux';
import { Select } from '../../common/forms';
import { getGroups, getSelectedGroupId } from './reducers';
import { groupSelected } from './actions';

const orderByName = ({ name: a }, { name: b }) => a.localeCompare(b);

export const GroupSelect = ({ groups, selected, onSelect }) => {
  const selectGroup = e => onSelect(e.target.value);

  return (
    <Select
      id="groups"
      value={selected}
      onChange={selectGroup}
      style={{ display: 'inline', paddingLeft: '5px', width: '200px' }}
    >
      <option value="unassigned">Unassigned</option>
      {
        groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)
      }
      <option value="all">All members</option>
    </Select>
  );
};

const mapStateToProps = state => ({
  groups: getGroups(state).sort(orderByName),
  selected: getSelectedGroupId(state),
});

export default connect(mapStateToProps, { onSelect: groupSelected })(GroupSelect);
