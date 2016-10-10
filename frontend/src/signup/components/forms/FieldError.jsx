import React from 'react';

const FieldError = ({ error }) => <span className="error">{error}</span>;

FieldError.propTypes = { error: React.PropTypes.string };

export default FieldError;
