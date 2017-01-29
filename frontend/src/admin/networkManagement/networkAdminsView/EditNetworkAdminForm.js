import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { InputField, FormHeaderWithSave } from '../../common/forms';
import { getSelectedNetworkAdmin, getSelectedNetworkAdminEmail, getIsCreating } from './reducers';

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
    <section>
      <FormHeaderWithSave>
        Network Admin details
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
  initialValues: getIsCreating(state) ? {} : getSelectedNetworkAdmin(state),
  email: getIsCreating(state) ? '' : getSelectedNetworkAdminEmail(state),
  isCreating: getIsCreating(state),
});
export default connect(mapStateToProps)(reduxForm({
  form: 'networkAdmin',
  validate,
  onSubmit,
})(EditNetworkAdminForm));
