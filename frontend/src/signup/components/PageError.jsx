import React from 'react';

const Errors = ({ pageError }) => (
  <div className="error">{pageError}</div>
);

Errors.propTypes = {
  pageError: React.PropTypes.string,
};

export default Errors;
