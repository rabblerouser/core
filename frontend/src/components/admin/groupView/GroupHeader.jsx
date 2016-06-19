import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';
import DeleteGroupButton from './DeleteGroupButton.jsx';

const GroupHeader = ({ onSave, onDelete, group }) => (
  <span className="actions">
    <EditGroupModalLauncher onSave={onSave} group={group} />
    <DeleteGroupButton onDelete={onDelete} group={group} />
  </span>
);

GroupHeader.propTypes = {
  group: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

export default GroupHeader;
