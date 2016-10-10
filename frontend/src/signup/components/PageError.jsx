import React from 'react';

const Errors = ({ pageError }) => (
  <div className="validationErrors">
    <div className="validationErrors-text">
      <span>{pageError}</span>
    </div>
  </div>
);

Errors.propTypes = {
  pageError: React.PropTypes.string,
};

export default Errors;
