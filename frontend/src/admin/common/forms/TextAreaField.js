import React from 'react';
import FieldError from './FieldError';
import Label from './Label';
import TextArea from './TextArea';

const TextAreaField = ({ input, label, placeholder, optional, id, meta: { touched, error } }) => {
  const classNames = () => {
    const isErrored = (touched && error) ? 'invalid' : '';
    const isOptional = optional ? 'optional' : '';
    return `${isErrored} ${isOptional}`.trim();
  };

  return (
    <div>
      <Label
        htmlFor={input.name}
        className={classNames()}
      >
        {label}
        {touched && error ? <FieldError error={error} /> : ''}
      </Label>
      <TextArea className={id} id={id} {...input} placeholder={placeholder} />
    </div>);
};

export default TextAreaField;
