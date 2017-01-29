import React from 'react';
import { connect } from 'react-redux';
import { Select } from '../common/forms';

import {
  getSelectedBranchId,
  getAvailableBranches,
} from '../reducers/branchReducers';
import { branchSelected } from '../actions';

export const BranchSelectBox = ({ selected, onSelect, branches, style }) => {
  const onChange = event => onSelect(event.target.value);
  return (
    <Select value={selected} onChange={onChange} style={style}>
      {branches.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
    </Select>
  );
};

const mapStateToProps = state => ({
  branches: getAvailableBranches(state),
  selected: getSelectedBranchId(state),
});

export default connect(mapStateToProps, { onSelect: branchSelected })(BranchSelectBox);
