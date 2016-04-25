import { ApplicationFormFieldLabels as Labels } from '../../config/strings.js';
import React from 'react';
import InlineError from './InlineError.jsx';


const FormFieldLabel = props => {
  const error = props.hasError && props.fieldName ? <InlineError errorFor={props.fieldName} /> : '';
  const optional = props.isOptional ? <span className="optional"> (optional)</span> : <span className="mandatory" />;

  return (
    <label className={props.hasError ? 'invalid' : ''} htmlFor={props.fieldName}>
      {Labels[props.fieldName]}
      {optional}
      {error}
    </label>
  );
};

export default FormFieldLabel;
