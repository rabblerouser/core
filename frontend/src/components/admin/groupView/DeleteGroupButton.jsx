import React from 'react';

export default ({ onDelete, group }) => {
  const deleteGroup = () => {
    if (confirm('Are you sure you want to delete the current group?')) {
      onDelete(group);
    }
  };

  return <button onClick={deleteGroup} className="delete" title="Delete group"><span>Delete group</span></button>;
};
