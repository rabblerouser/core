import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { InputField, TextAreaField, SelectField } from '../../common/forms/';
import RegisterButton from './RegisterButton';
import FormHeader from './FormHeader';

import { getBranches } from '../reducers';
import { registerRequested } from '../actions';
import validate from '../validator';

const onSubmit = (member, dispatch) => (
  new Promise((resolve, reject) =>
    dispatch((registerRequested)(member, resolve, reject))
  )
);

export const DetailsForm = ({ handleSubmit, branches }) => (
  <section>
    <form onSubmit={handleSubmit}>
      <FormHeader />
      <div>
        <Field component={InputField} id="firstName" name="firstName" label="First name" type="text" />
        <Field component={InputField} id="lastName" name="lastName" label="Last name" type="text" />
        <Field component={InputField} id="email" name="email" label="Email address" type="text" />
        <Field
          component={InputField}
          id="primaryPhoneNumber"
          name="primaryPhoneNumber"
          label="Contact number"
          type="text"
        />
        <Field component={TextAreaField} id="additionalInfo" name="additionalInfo" label="Additional information" />
        <Field component={SelectField} id="branchId" name="branchId" label="Branch to join">
          {
            branches.map(branch => (<option key={branch.id} value={branch.id}>{branch.name}</option>))
          }
        </Field>
        <RegisterButton>Register</RegisterButton>
      </div>
    </form>
  </section>
);

DetailsForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  branches: React.PropTypes.array.isRequired,
};

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
