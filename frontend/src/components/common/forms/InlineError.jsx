import React from 'react';
import { FormValidationErrors as Errors } from '../../../config/strings.js';

const InlineError = props => (
  <span className="invalid">
    <span className="errors">
      {Errors[props.errorFor] ? Errors[props.errorFor].message : ''}
    </span>
  </span>
);

InlineError.propTypes = {
  errorFor: React.PropTypes.string,
};

export default InlineError;
