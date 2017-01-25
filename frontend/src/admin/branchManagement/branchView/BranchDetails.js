import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranch } from '../../reducers/branchReducers';
import { Panel } from '../../common';
import BranchActions from './BranchActions';

export const BranchDetails = ({ selectedBranch }) => (
  <Panel>
    <h3>
      {selectedBranch.name}
      <BranchActions />
    </h3>
    <ul>
      <li>Contact {selectedBranch.contact}</li>
      <li>Notes {selectedBranch.notes}</li>
    </ul>
  </Panel>
);

const mapStateToProps = state => ({
  selectedBranch: getSelectedBranch(state),
});

export default connect(mapStateToProps)(BranchDetails);
