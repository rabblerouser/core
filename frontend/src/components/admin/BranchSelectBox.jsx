import React from 'react';
import { connect } from 'react-redux';

import {
  getSelectedBranchId,
  getAvailableBranches,
} from '../../reducers/branchReducers';

import * as branchActions from '../../actions/branchActions';

export const BranchSelectBox = ({ selected, branchSelected, branches }) => {
  const onChange = event => branchSelected(event.target.value);
  return (
    <select id="branches" value={selected} onChange={onChange}>
      {branches.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
    </select>
  );
};

BranchSelectBox.propTypes = {
  branches: React.PropTypes.array,
  selected: React.PropTypes.string,
  branchSelected: React.PropTypes.func,
};

const mapStateToProps = state => ({
  branches: getAvailableBranches(state),
  selected: getSelectedBranchId(state),
});

export default connect(mapStateToProps, branchActions)(BranchSelectBox);
