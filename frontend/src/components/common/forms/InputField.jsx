import React from 'react';
import FieldError from './FieldError';

const InputField = ({ input, label, placeholder, type, optional, id, meta: { touched, error } }) => {
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
      <input className={id} id={id} {...input} placeholder={placeholder} type={type} />
    </div>
  );
};
InputField.propTypes = {
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  type: React.PropTypes.string,
  optional: React.PropTypes.bool,
  meta: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
};
export default InputField;
