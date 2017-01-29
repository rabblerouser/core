import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import validate from './branchValidator';
import {
  branchUpdateRequested as update,
  branchCreateRequested as create,
  finishEditBranch,
} from './actions';
import { getEditedBranch } from './reducers';

import { InputField, TextAreaField, FormHeaderWithSave } from '../../common/forms';

const onSubmit = (data, dispatch) => (
  dispatch(data.id ? update(data) : create(data))
  .then(() => dispatch(finishEditBranch()))
);

export const EditBranchForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <section>
      <FormHeaderWithSave>
        Branch details
      </FormHeaderWithSave>
      <Field component={InputField} name="name" label="Name" type="text" />
      <Field component={TextAreaField} name="contact" label="Contact" />
      <Field component={TextAreaField} name="notes" label="Notes" />
    </section>
  </form>
);

const mapStateToProps = state => ({ initialValues: getEditedBranch(state) });
export default connect(mapStateToProps)(reduxForm({
  form: 'branch',
  validate,
  onSubmit,
})(EditBranchForm));
