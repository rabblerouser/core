import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { InputField, TextAreaField, SelectField } from './forms';
import AddressFields from './AddressFields';

import { getBranches } from '../reducers';
import { registerRequested } from '../actions';
import validate from '../validator';

const onSubmit = (member, dispatch) => (
  new Promise((resolve, reject) =>
    dispatch((registerRequested)(member, resolve, reject)),
  )
);

export const DetailsForm = ({ handleSubmit, branches, addressEnabled = customisation.addressEnabled }) => (
  <section>
    <h1>{customisation.signupTitle}</h1>
    <h2>{customisation.signupSubtitle}</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <Field component={InputField} id="firstName" name="firstName" label="First name" type="text" />
        <Field component={InputField} id="lastName" name="lastName" label="Last name" type="text" optional />
        <Field component={InputField} id="email" name="email" label="Email address" type="text" />
        <Field
          optional
          component={InputField}
          id="primaryPhoneNumber"
          name="primaryPhoneNumber"
          label="Contact number"
          type="text"
        />
        {addressEnabled &&
          <AddressFields />
        }
        {branches.length > 1 &&
          <Field component={SelectField} id="branchId" name="branchId" label="Branch to join">
            {branches.map(branch => (<option key={branch.id} value={branch.id}>{branch.name}</option>))}
          </Field>
        }
        <Field
          component={TextAreaField}
          optional
          id="additionalInfo"
          name="additionalInfo"
          label="Additional information"
        />
      </div>
      <button type="submit">Register</button>
    </form>
  </section>
);

const mapStateToProps = state => ({
  branches: getBranches(state),
  initialValues: {
    branchId: getBranches(state)[0] && getBranches(state)[0].id,
  },
});

export default connect(mapStateToProps)(reduxForm({
  form: 'branch',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  onSubmit,
})(DetailsForm));
