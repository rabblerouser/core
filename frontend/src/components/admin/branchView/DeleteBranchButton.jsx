import React from 'react';

export default ({ onDelete, branch }) => {
  const deleteBranch = () => {
    if (confirm('Are you sure you want to delete the current branch?')) {
      onDelete(branch);
    }
  };

  return <button onClick={deleteBranch} className="delete" title="Delete branch"><span>Delete branch</span></button>;
};
