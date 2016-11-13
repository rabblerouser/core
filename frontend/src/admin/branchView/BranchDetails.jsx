import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranch } from '../reducers/branchReducers';
import BranchActions from './BranchActions';

export const BranchDetails = ({ selectedBranch }) => (
  <section className="admin-section" id="branchDetails">
    <h3>
      {selectedBranch.name}
      <BranchActions />
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

BranchDetails.propTypes = {
  selectedBranch: React.PropTypes.object,
};

export default connect(mapStateToProps)(BranchDetails);
