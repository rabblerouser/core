import React from 'react';

const DeleteGroupButton = ({ onDelete, group }) => {
  const deleteGroup = () => {
    if (confirm('Are you sure you want to delete the current group?')) { // eslint-disable-line no-alert
      onDelete(group);
    }
  };

  return <button onClick={deleteGroup} className="delete" title="Delete group"><span>Delete group</span></button>;
};

DeleteGroupButton.propTypes = {
  onDelete: React.PropTypes.func,
  group: React.PropTypes.object,
};

export default DeleteGroupButton;
