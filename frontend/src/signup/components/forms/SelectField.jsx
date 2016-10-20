import React from 'react';
import FieldError from './FieldError';

const SelectField = ({ input, label, type, id, meta: { touched, error }, children }) => (
  <fieldset>
    <label htmlFor={input.name}>
      {label}
      {touched && error && <FieldError error={error} />}
    </label>
    <select id={id} {...input} type={type}>
      {children}
    </select>
  </fieldset>
);

SelectField.propTypes = {
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string,
  children: React.PropTypes.any,
  type: React.PropTypes.string,
  meta: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
};
export default SelectField;
