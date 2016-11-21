import React from 'react';
import GroupHeader from './GroupHeader';
import GroupDetails from './GroupDetails';

const GroupDetailView = ({ selectedGroup, onSave, onDelete }) => (
  <section className="admin-section" id="description">
    <GroupDetails group={selectedGroup} />
    <GroupHeader onSave={onSave} onDelete={onDelete} group={selectedGroup} />
  </section>
);

GroupDetailView.propTypes = {
  selectedGroup: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

export default GroupDetailView;
