import React from 'react';
import { Field } from 'redux-form';
import { InputField } from './forms';

const AddressFields = () => (
  <fieldset>
    <Field
      optional
      component={InputField}
      id="address"
      name="address[address]"
      label="Street address"
      type="text"
    />
    <Field optional component={InputField} id="suburb" name="address[suburb]" label="Suburb" type="text" />
    <Field optional component={InputField} id="state" name="address[state]" label="State" type="text" />
    <Field optional component={InputField} id="postcode" name="address[postcode]" label="Postcode" type="text" />
    <Field optional component={InputField} id="country" name="address[country]" label="Country" type="text" />
  </fieldset>
);

export default AddressFields;
