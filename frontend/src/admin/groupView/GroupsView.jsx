import React from 'react';
import GroupsList from './GroupsList';
import GroupDetailView from './GroupDetailView';
import AddGroupModalLauncher from './AddGroupModalLauncher';

const GroupsView = ({ selectedBranchId, selectedGroup, onSelectGroup, onSaveGroup, onDeleteGroup }) => {
  const detailsView =
    selectedGroup && (<GroupDetailView
      selectedGroup={selectedGroup}
      onSave={onSaveGroup}
      onDelete={onDeleteGroup}
    />);
  return (
    <section className="admin-section" id="group-details">
      <h3>
        Groups
        <AddGroupModalLauncher onSave={onSaveGroup} />
        <a href={`/branches/${selectedBranchId}/members.csv`}>Export all...</a>
      </h3>
      <GroupsList onSelect={onSelectGroup} />
      {detailsView}
    </section>
  );
};

GroupsView.propTypes = {
  selectedBranchId: React.PropTypes.string.isRequired,
  selectedGroup: React.PropTypes.object,
  onSelectGroup: React.PropTypes.func,
  onSaveGroup: React.PropTypes.func,
  onDeleteGroup: React.PropTypes.func,
};

export default GroupsView;
