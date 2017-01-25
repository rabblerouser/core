import React from 'react';
import FieldError from './FieldError';
import Label from './Label';
import Input from './Input';

const InputField = ({ input, label, placeholder, type, optional, id, meta: { touched, error } }) => {
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
      <Input className={id} id={id} {...input} placeholder={placeholder} type={type} />
    </div>
  );
};

export default InputField;
