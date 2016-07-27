import React from 'react';

const DeleteButton = ({ confirmMessage, onDelete, title }) => {
  const onClick = () => {
    if (confirm(confirmMessage)) { // eslint-disable-line no-alert
      onDelete();
    }
  };

  return (
    <div className="buttons">
      <button onClick={onClick} className="delete" title={title}><span>{title}</span></button>
    </div>
  );
};

DeleteButton.propTypes = {
  confirmMessage: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  onDelete: React.PropTypes.func.isRequired,
};

export default DeleteButton;
