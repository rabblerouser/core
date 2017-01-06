import React from 'react';
import FieldError from './FieldError';

const TextAreaField = ({ input, label, placeholder, optional, id, meta: { touched, error } }) => {
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
      <textarea className={id} id={id} {...input} placeholder={placeholder} />
    </div>);
};

export default TextAreaField;
