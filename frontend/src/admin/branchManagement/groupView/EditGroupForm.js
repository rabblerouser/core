import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { InputField, TextAreaField, FormHeaderWithSave } from '../../common/forms';
import { getSelectedGroup, getIsCreating } from './reducers';
import {
  groupUpdateRequested as update,
  groupCreateRequested as create,
  finishEditGroup,
} from './actions';

import validate from './groupValidator';

const onSubmit = (data, dispatch) => (
  dispatch(data.id ? update(data) : create(data))
  .then(() => dispatch(finishEditGroup()))
);

export const EditGroupForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <section className="form-container">
      <FormHeaderWithSave>
        Group details
      </FormHeaderWithSave>
      <Field component={InputField} id="name" name="name" label="Name" type="text" />
      <Field component={TextAreaField} id="description" name="description" label="Description" />
    </section>
  </form>
);

const mapStateToProps = state => ({
  initialValues: getIsCreating(state) ? {} : getSelectedGroup(state),
});
export default connect(mapStateToProps)(reduxForm({
  form: 'group',
  validate,
  onSubmit,
})(EditGroupForm));
