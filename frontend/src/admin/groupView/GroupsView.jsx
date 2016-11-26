import React from 'react';
import { connect } from 'react-redux';

import { getSelectedBranchId } from '../reducers/branchReducers';
import GroupsList from './GroupsList';
import GroupDetailView from './GroupDetailView';
import AddGroupModalLauncher from './AddGroupModalLauncher';

const GroupsView = ({ selectedBranchId, onSelectGroup, onSaveGroup, onDeleteGroup }) => (
  <section className="admin-section" id="group-details">
    <h3>
      Groups
      <AddGroupModalLauncher onSave={onSaveGroup} />
      <a href={`/branches/${selectedBranchId}/members.csv`}>Export all...</a>
    </h3>
    <GroupsList onSelect={onSelectGroup} />
    <GroupDetailView
      onSave={onSaveGroup}
      onDelete={onDeleteGroup}
    />
  </section>
);

GroupsView.propTypes = {
  selectedBranchId: React.PropTypes.string.isRequired,
  onSelectGroup: React.PropTypes.func,
  onSaveGroup: React.PropTypes.func,
  onDeleteGroup: React.PropTypes.func,
};

const mapStateToProps = state => ({
  selectedBranchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps)(GroupsView);
