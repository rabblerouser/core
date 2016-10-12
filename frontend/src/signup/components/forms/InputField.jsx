import React from 'react';
import FieldError from './FieldError';

const InputField = ({ input, label, placeholder, type, optional, id, meta: { touched, error } }) => (
  <fieldset className={id}>
    <label htmlFor={input.name}>
      {`${label}${optional ? '' : ' *'}`}
    </label>
    <input id={id} {...input} placeholder={placeholder} type={type} />
    {touched && error && <FieldError error={error} />}
  </fieldset>
);

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
