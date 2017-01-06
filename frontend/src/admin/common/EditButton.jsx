import React from 'react';

const EditButton = ({ onClick, title = 'Edit', children }) => (
  <button onClick={onClick} className="edit" title={title}>
    {children}
  </button>
);

export default EditButton;
