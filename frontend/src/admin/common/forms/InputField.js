import React from 'react';
import FieldError from './FieldError';
import Label from './Label';
import Input from './Input';

const InputField = ({ input, label, placeholder, type, meta: { touched, error } }) => (
  <div>
    <Label
      htmlFor={input.name}
    >
      {label}
      {touched && error ? <FieldError error={error} /> : ''}
    </Label>
    <Input {...input} placeholder={placeholder} type={type} />
  </div>
);

export default InputField;
