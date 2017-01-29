import React from 'react';
import FieldError from './FieldError';
import Label from './Label';
import TextArea from './TextArea';

const TextAreaField = ({ input, label, placeholder, meta: { touched, error } }) => (
  <div>
    <Label
      htmlFor={input.name}
    >
      {label}
      {touched && error ? <FieldError error={error} /> : ''}
    </Label>
    <TextArea {...input} placeholder={placeholder} />
  </div>
);

export default TextAreaField;
