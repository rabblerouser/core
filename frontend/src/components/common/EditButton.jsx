import React from 'react';

const EditButton = ({ onClick, title, children }) => (
  <button onClick={onClick} className="edit" title={title}>
    {children}
  </button>
);

EditButton.propTypes = {
  children: React.PropTypes.object,
  title: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default EditButton;
