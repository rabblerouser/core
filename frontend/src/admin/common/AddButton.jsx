import React from 'react';

const AddButton = ({ onClick, title = 'Add', children }) => (
  <button onClick={onClick} className="new" title={title}>
    {children}
  </button>
);

AddButton.propTypes = {
  children: React.PropTypes.any,
  title: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired,
};

export default AddButton;
