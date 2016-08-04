import React from 'react';
import _ from 'lodash';
import FormFieldLabel from '../../form/FormFieldLabel';

const EditAdminFields = ({ invalidFields, onChange, formValues }) => {
  function isValidationError(fieldName) {
    return _.indexOf(invalidFields, fieldName) > -1;
  }

  return (
    <section>
      <FormFieldLabel fieldName="name" hasError={isValidationError('name')} />
      <input type="text" defaultValue={formValues.name} onChange={onChange('name')} id="name" className="name" />
      <FormFieldLabel fieldName="contactNumber" hasError={isValidationError('phoneNumber')} />
      <input
        type="tel"
        defaultValue={formValues.phoneNumber}
        onChange={onChange('phoneNumber')}
        id="contactNumber"
        className="contactNumber"
      />
      <FormFieldLabel fieldName="password" hasError={isValidationError('password')} />
      <aside>Leave blank to keep existing password</aside>
      <input
        type="password"
        placeholder="••••••••••••"
        onChange={onChange('password')}
        id="password"
        className="password"
      />
      {
        formValues.password ?
          <FormFieldLabel fieldName="confirmedPassword" hasError={isValidationError('confirmedPassword')} /> :
          ''
      }
      {
        formValues.password ?
          <input
            type="password"
            onChange={onChange('confirmedPassword')}
            id="confirmedPassword"
            className="password"
          /> :
          ''
      }
    </section>
  );
};

EditAdminFields.propTypes = {
  invalidFields: React.PropTypes.array,
  onChange: React.PropTypes.func,
  formValues: React.PropTypes.object,
};

export default EditAdminFields;
