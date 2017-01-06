import React from 'react';
import FieldError from './FieldError';

const TextAreaField = ({ input, label, placeholder, optional, id, meta: { touched, error } }) => (
  <fieldset>
    <label htmlFor={input.name}>
      {`${label}${optional ? '' : ' *'}`}
      {touched && error && <FieldError error={error} />}
    </label>
    <textarea className={id} id={id} {...input} placeholder={placeholder} />
  </fieldset>
);

export default TextAreaField;
