import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranch } from '../../../reducers/branchReducers';
import SelectedBranchActions from './SelectedBranchActions';

const BranchDetailsView = ({ selectedBranch }) => (
  <section className="admin-section" id="branchDetails">
    <h3>
      {selectedBranch.name}
      <SelectedBranchActions />
    </h3>
    <dl>
      <dt>Contact</dt>
      <dd className="textblock">{selectedBranch.contact}</dd>
      <dt>Notes</dt>
      <dd className="textblock">{selectedBranch.notes}</dd>
    </dl>
  </section>
);

const mapStateToProps = state => ({
  selectedBranch: getSelectedBranch(state),
});

BranchDetailsView.propTypes = {
  selectedBranch: React.PropTypes.object,
};

export default connect(mapStateToProps)(BranchDetailsView);
