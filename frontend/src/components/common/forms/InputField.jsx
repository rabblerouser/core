import React from 'react';
import FieldError from './FieldError';

const InputField = ({ input, label, type, id, meta: { touched, error } }) => (
  <div>
    <label htmlFor={input.name} className={(touched && error) ? 'invalid' : ''}>
      {label}
      {touched && error ? <FieldError error={error} /> : ''}
    </label>
    <input className={id} id={id} {...input} placeholder={label} type={type} />
  </div>
);

InputField.propTypes = {
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  meta: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
};
export default InputField;
