import React from 'react';
import FieldError from './FieldError';

const TextAreaField = ({ input, label, placeholder, optional, id, meta: { touched, error } }) => {
  const classNames = () => {
    const isErrored = (touched && error) ? 'invalid' : '';
    const isOptional = optional ? 'optional' : '';
    return `${isErrored} ${isOptional}`;
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

TextAreaField.propTypes = {
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  optional: React.PropTypes.bool,
  meta: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
};
export default TextAreaField;
