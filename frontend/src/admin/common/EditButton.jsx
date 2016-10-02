import React from 'react';

const EditButton = ({ onClick, title = 'Edit', children }) => (
  <button onClick={onClick} className="edit" title={title}>
    {children}
  </button>
);

EditButton.propTypes = {
  children: React.PropTypes.any,
  title: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired,
};

export default EditButton;
