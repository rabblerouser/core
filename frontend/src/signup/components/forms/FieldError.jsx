import React from 'react';

const FieldError = ({ error }) => <span className="invalid"><span className="errors">{error}</span></span>;

FieldError.propTypes = { error: React.PropTypes.string };

export default FieldError;
