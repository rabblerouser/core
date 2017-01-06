import React from 'react';
import { Field } from 'redux-form';
import { InputField } from './forms';

const AddressFields = () => (
  <fieldset>
    <Field
      optional
      component={InputField}
      id="address"
      name="postalAddress[address]"
      label="Street address"
      type="text"
    />
    <Field optional component={InputField} id="suburb" name="postalAddress[suburb]" label="Suburb" type="text" />
    <Field optional component={InputField} id="state" name="postalAddress[state]" label="State" type="text" />
    <Field optional component={InputField} id="postcode" name="postalAddress[postcode]" label="Postcode" type="text" />
    <Field optional component={InputField} id="country" name="postalAddress[country]" label="Country" type="text" />
  </fieldset>
);

export default AddressFields;
