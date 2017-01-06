import React from 'react';

const AddButton = ({ onClick, title = 'Add', children }) => (
  <button onClick={onClick} className="new" title={title}>
    {children}
  </button>
);

export default AddButton;
