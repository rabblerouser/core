import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranchId } from '../reducers/branchReducers';
import GroupsList from './GroupsList';
import GroupDetails from './GroupDetails';
import GroupModal from './GroupModal';
import CreateGroupButton from './CreateGroupButton';

const GroupsView = ({ selectedBranchId, onSelectGroup }) => (
  <section className="admin-section" id="group-details">
    <h3>
      Groups
      <CreateGroupButton />
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
};

const mapStateToProps = state => ({
  selectedBranchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps)(GroupsView);
