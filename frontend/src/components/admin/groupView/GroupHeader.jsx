import React from 'react';
import EditGroupModalLauncher from './EditGroupModalLauncher.jsx';
import DeleteButton from '../../common/DeleteButton.jsx';

const GroupHeader = ({ onSave, onDelete, group }) => (
  <span className="actions">
    <EditGroupModalLauncher onSave={onSave} group={group} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current group?"
      title="Delete group"
      onDelete={() => onDelete(group)}
    />
  </span>
);

GroupHeader.propTypes = {
  group: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

export default GroupHeader;
