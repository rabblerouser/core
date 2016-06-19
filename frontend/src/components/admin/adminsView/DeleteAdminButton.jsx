import React from 'react';

const DeleteAdminButton = ({ onDelete, admin }) => {
  const deleteAdmin = () => {
    if (confirm('Are you sure you want to delete the selected person?')) { // eslint-disable-line no-alert
      onDelete(admin);
    }
  };

  return (<div className="buttons">
    <button onClick={deleteAdmin} className="delete" title="Delete admin"><span>Delete admin</span></button>
  </div>);
};

DeleteAdminButton.propTypes = {
  admin: React.PropTypes.object.isRequired,
  onDelete: React.PropTypes.func.isRequired,
};

export default DeleteAdminButton;
