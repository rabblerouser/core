import React from 'react';
import FieldError from './FieldError';

const SelectField = ({ input, label, type, id, meta: { touched, error }, children, multiple }) => (
  <div>
    <label htmlFor={input.name} className={(touched && error) ? 'invalid' : ''}>
      {label}
      {touched && error ? <FieldError error={error} /> : ''}
    </label>
    <select className={id} id={id} {...input} type={type} multiple={multiple} >
      {children}
    </select>
  </div>
);

export default SelectField;
