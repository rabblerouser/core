import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { InputField, FormHeaderWithSave } from '../../common/forms';
import { getSelectedAdmin, getSelectedAdminEmail, getIsCreating } from './reducers';

import {
  adminUpdateRequested as update,
  adminCreateRequested as create,
  finishEditAdmin,
} from './actions';

import validate from './adminValidator';

const onSubmit = (data, dispatch) => (
  dispatch(data.id ? update(data) : create(data))
  .then(() => dispatch(finishEditAdmin()))
);

export const EditAdminForm = ({ handleSubmit, isCreating, email }) => (
  <form onSubmit={handleSubmit}>
    <section>
      <FormHeaderWithSave>
        Admin details
      </FormHeaderWithSave>
      {isCreating ?
        <Field component={InputField} name="email" label="Email" type="email" />
        : email
      }
      <Field component={InputField} name="name" label="Name" type="text" />
      <Field component={InputField} name="phoneNumber" label="Contact number" type="text" />
      {!isCreating && <aside>Leave blank to keep existing password</aside>}

      <Field
        component={InputField}
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••••••"
      />
      <Field
        component={InputField}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
      />
    </section>
  </form>
);

const mapStateToProps = state => ({
  initialValues: getIsCreating(state) ? {} : getSelectedAdmin(state),
  email: getIsCreating(state) ? '' : getSelectedAdminEmail(state),
  isCreating: getIsCreating(state),
});
export default connect(mapStateToProps)(reduxForm({
  form: 'admin',
  validate,
  onSubmit,
})(EditAdminForm));
