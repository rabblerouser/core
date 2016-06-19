import React from 'react';
import GroupHeader from './GroupHeader.jsx';
import GroupDetails from './GroupDetails.jsx';

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
