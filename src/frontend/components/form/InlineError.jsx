import React from 'react';
import { FormValidationErrors as Errors } from '../../config/strings.js';

const InlineError = props => (
  <span className="invalid">
    <span className="errors">
      {Errors[props.errorFor] ? Errors[props.errorFor].message : ''}
    </span>
  </span>
);

export default InlineError;
