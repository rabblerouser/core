import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { InputField } from '../../common/forms';
import { Button } from '../../common';
import { getSelectedAdmin, getIsCreating } from './reducers';

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
    <section className="form-container">
      <header className="details-header">
        <span className="title">Admin details</span>
        <span className="actions">
          <Button className="save" type="submit">Save</Button>
        </span>
      </header>
      {isCreating ?
        <Field component={InputField} id="email" name="email" label="Email" type="email" />
        : email
      }
      <Field component={InputField} id="name" name="name" label="Name" type="text" />
      <Field component={InputField} id="phoneNumber" name="phoneNumber" label="Contact number" type="text" />
      {!isCreating && <aside>Leave blank to keep existing password</aside>}

      <Field
        component={InputField}
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••••••"
      />
      <Field
        component={InputField}
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
      />
    </section>
  </form>
);

const mapStateToProps = state => ({
  initialValues: getIsCreating(state) ? {} : getSelectedAdmin(state),
  email: getIsCreating(state) ? '' : getSelectedAdmin(state).email,
  isCreating: getIsCreating(state),
});
export default connect(mapStateToProps)(reduxForm({
  form: 'admin',
  validate,
  onSubmit,
})(EditAdminForm));
