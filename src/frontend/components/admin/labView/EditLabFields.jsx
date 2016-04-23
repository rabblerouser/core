import React from 'react';
import _ from 'lodash';
import FormFieldLabel from '../../form/FormFieldLabel.jsx';

const EditLabFields = ({ invalidFields, onChange, formValues }) => {
  function isValidationError(fieldName) {
    return _.indexOf(invalidFields, fieldName) > -1;
  }

  return (
    <section>
      <FormFieldLabel fieldName="name" hasError={isValidationError('name')} />
      <input type="text" defaultValue={formValues.name} onChange={onChange('name')} id="name" className="name" />
      <FormFieldLabel fieldName="contact" hasError={isValidationError('contact')} />
      <textarea defaultValue={formValues.contact} onChange={onChange('contact')} id="contact" className="contact" />
      <FormFieldLabel fieldName="notes" hasError={isValidationError('notes')} />
      <textarea defaultValue={formValues.notes} onChange={onChange('notes')} id="notes" className="notes" />
    </section>
  );
};

EditLabFields.propTypes = {
  invalidFields: React.PropTypes.array,
  onChange: React.PropTypes.func,
  formValues: React.PropTypes.object,
};

export default EditLabFields;
