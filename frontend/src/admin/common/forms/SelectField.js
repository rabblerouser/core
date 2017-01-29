import React from 'react';

import FieldError from './FieldError';
import Select from './Select';
import Label from './Label';

const SelectField = ({ input, label, type, meta: { touched, error }, children, multiple }) => (
  <div>
    <Label htmlFor={input.name}>
      {label}
      {touched && error ? <FieldError error={error} /> : ''}
    </Label>
    <Select {...input} type={type} multiple={multiple} >
      {children}
    </Select>
  </div>
);

export default SelectField;
