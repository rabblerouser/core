import React from 'react';
import FieldError from './FieldError';

const InputField = ({ input, label, placeholder, type, optional, id, meta: { touched, error } }) => (
  <fieldset className={id}>
    <label htmlFor={input.name}>
      {`${label}${optional ? '' : ' *'}`}
    </label>
    <input id={id} {...input} placeholder={placeholder} type={type} />
    {touched && error && <FieldError error={error} />}
  </fieldset>
);

export default InputField;
