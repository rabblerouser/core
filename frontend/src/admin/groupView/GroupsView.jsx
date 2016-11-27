import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranchId } from '../reducers/branchReducers';
import GroupSelect from './GroupSelect';
import GroupDetails from './GroupDetails';
import GroupModal from './GroupModal';
import { AddButton } from '../common';
import { createGroup } from './actions';

const GroupsView = ({ selectedBranchId, create }) => (
  <section className="admin-section" id="group-details">
    <h3>
      Groups
      <AddButton onClick={create} />
      <a href={`/branches/${selectedBranchId}/members.csv`}>Export all...</a>
    </h3>
    <GroupSelect />
    <GroupDetails />
    <GroupModal />
  </section>
);

GroupsView.propTypes = {
  selectedBranchId: React.PropTypes.string.isRequired,
  create: React.PropTypes.func,
};

const mapStateToProps = state => ({
  selectedBranchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, { create: createGroup })(GroupsView);
