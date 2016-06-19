import React from 'react';

const DeleteBranchButton = ({ onDelete, branch }) => {
  const deleteBranch = () => {
    if (confirm('Are you sure you want to delete the current branch?')) { // eslint-disable-line no-alert
      onDelete(branch);
    }
  };

  return <button onClick={deleteBranch} className="delete" title="Delete branch"><span>Delete branch</span></button>;
};

DeleteBranchButton.propTypes = {
  onDelete: React.PropTypes.func.isRequired,
  branch: React.PropTypes.object,
};

export default DeleteBranchButton;
