import React from 'react';
import GroupsList from './GroupsList.jsx';
import GroupDetailView from './GroupDetailView.jsx';
import AddGroupModalLauncher from './AddGroupModalLauncher.jsx';

export default ({ selectedGroup, groups, onSelectGroup, onSaveGroup, onDeleteGroup }) => {
  const detailsView = selectedGroup ? (<GroupDetailView selectedGroup={selectedGroup}
    onSave={onSaveGroup}
    onDelete={onDeleteGroup}
  />) : '';
  return (
    <section className="admin-section" id="group-details">
      <h3>Groups <AddGroupModalLauncher
        onSave={onSaveGroup}
      /></h3>

      <GroupsList
        groups={groups}
        onSelect={onSelectGroup}
      />

      {detailsView}
    </section>
  );
};
