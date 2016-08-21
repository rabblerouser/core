import React from 'react';

const AddButton = ({ onClick, title, children }) => (
  <button onClick={onClick} className="new" title={title}>
    {children}
  </button>
);

AddButton.propTypes = {
  children: React.PropTypes.any,
  title: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default AddButton;
