import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranchId } from '../reducers/branchReducers';
import GroupsList from './GroupsList';
import GroupDetails from './GroupDetails';
import GroupModal from './GroupModal';
import { AddButton } from '../common';
import { createGroup } from './actions';

const GroupsView = ({ selectedBranchId, onSelectGroup, create }) => (
  <section className="admin-section" id="group-details">
    <h3>
      Groups
      <AddButton onClick={create} />
      <a href={`/branches/${selectedBranchId}/members.csv`}>Export all...</a>
    </h3>
    <GroupsList onSelect={onSelectGroup} />
    <GroupDetails />
    <GroupModal />
  </section>
);

GroupsView.propTypes = {
  selectedBranchId: React.PropTypes.string.isRequired,
  onSelectGroup: React.PropTypes.func,
  create: React.PropTypes.func,
};

const mapStateToProps = state => ({
  selectedBranchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, { create: createGroup })(GroupsView);
