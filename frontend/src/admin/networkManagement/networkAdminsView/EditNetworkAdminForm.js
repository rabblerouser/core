import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '../../common';
import { InputField } from '../../common/forms';
import { getSelectedNetworkAdmin, getIsCreating } from './reducers';

import {
  networkAdminUpdateRequested as update,
  networkAdminCreateRequested as create,
  finishEditNetworkAdmin,
} from './actions';

import validate from './networkAdminValidator';

const onSubmit = (data, dispatch) => (
  dispatch(data.id ? update(data) : create(data))
  .then(() => dispatch(finishEditNetworkAdmin()))
);

export const EditNetworkAdminForm = ({ handleSubmit, isCreating, email }) => (
  <form onSubmit={handleSubmit}>
    <section className="form-container">
      <header className="details-header">
        <span className="title">Network Admin details</span>
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
  initialValues: getIsCreating(state) ? {} : getSelectedNetworkAdmin(state),
  email: getIsCreating(state) ? '' : getSelectedNetworkAdmin(state).email,
  isCreating: getIsCreating(state),
});
export default connect(mapStateToProps)(reduxForm({
  form: 'networkAdmin',
  validate,
  onSubmit,
})(EditNetworkAdminForm));
