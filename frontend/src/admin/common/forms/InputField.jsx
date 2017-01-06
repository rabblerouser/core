import React from 'react';
import FieldError from './FieldError';

const InputField = ({ input, label, placeholder, type, optional, id, meta: { touched, error } }) => {
  const classNames = () => {
    const isErrored = (touched && error) ? 'invalid' : '';
    const isOptional = optional ? 'optional' : '';
    return `${isErrored} ${isOptional}`.trim();
  };

  return (
    <div>
      <label
        htmlFor={input.name}
        className={classNames()}
      >
        {label}
        {touched && error ? <FieldError error={error} /> : ''}
      </label>
      <input className={id} id={id} {...input} placeholder={placeholder} type={type} />
    </div>
  );
};

export default InputField;
