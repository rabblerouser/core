import React from 'react';
import { connect } from 'react-redux';

import {
  getSelectedBranchId,
  getAvailableBranches,
} from '../reducers/branchReducers';
import { branchSelected } from '../actions';

export const BranchSelectBox = ({ selected, onSelect, branches }) => {
  const onChange = event => onSelect(event.target.value);
  return (
    <select id="branches" value={selected} onChange={onChange}>
      {branches.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
    </select>
  );
};

const mapStateToProps = state => ({
  branches: getAvailableBranches(state),
  selected: getSelectedBranchId(state),
});

export default connect(mapStateToProps, { onSelect: branchSelected })(BranchSelectBox);
