import React from 'react';
import { Field } from 'redux-form';
import { InputField } from './forms';

const AddressFields = () => (
  <fieldset id="postalAddress" name="postalAddress">
    <Field component={InputField} id="address" name="address" label="Street address" type="text" />
    <Field component={InputField} id="suburb" name="suburb" label="Suburb" type="text" />
    <Field component={InputField} id="state" name="state" label="State" type="text" />
    <Field component={InputField} id="postcode" name="postcode" label="Postcode" type="text" />
    <Field component={InputField} id="country" name="country" label="Country" type="text" />
  </fieldset>
);

export default AddressFields;
