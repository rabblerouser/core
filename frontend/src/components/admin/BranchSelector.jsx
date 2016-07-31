import React from 'react';
import { connect } from 'react-redux';

import {
  getSelectedBranchId,
  getAvailableBranches,
} from '../../reducers/branchReducers';

import { branchSelected } from '../../actions/';

const BranchSelector = ({ selected, onSelectBranch, branches }) => {
  const onChange = event => onSelectBranch(event.target.value);
  return (
    <select id="branches" value={selected} onChange={onChange}>
      {branches.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
    </select>
  );
};

BranchSelector.propTypes = {
  branches: React.PropTypes.array,
  selected: React.PropTypes.string,
  onSelectBranch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  branches: getAvailableBranches(state),
  selected: getSelectedBranchId(state),
});

const mapDispatchToProps = dispatch => ({
  onSelectBranch: branchId => dispatch(branchSelected(branchId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BranchSelector);
