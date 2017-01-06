import React from 'react';
import FieldError from './FieldError';

const SelectField = ({ input, label, type, id, meta: { touched, error }, children }) => (
  <fieldset>
    <label htmlFor={input.name}>
      {label}
      {touched && error && <FieldError error={error} />}
    </label>
    <select id={id} {...input} type={type}>
      {children}
    </select>
  </fieldset>
);

export default SelectField;
