import React from 'react';
import { connect } from 'react-redux';

import validate from './branchValidator';
import {
  branchUpdateRequested as update,
  branchCreateRequested as create,
} from '../../../actions/branchActions';
import { getEditedBranch } from '../../../reducers/branchReducers';

import { Field, reduxForm } from 'redux-form';
import InputField from '../../common/forms/InputField';
import TextAreaField from '../../common/forms/TextAreaField';

const onSubmit = (data, dispatch) =>
  new Promise((resolve, reject) =>
    dispatch(
      data.id ? update(data, resolve, reject) : create(data, resolve, reject)
    )
  );

export const EditBranchForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <header className="details-header">
      <span className="title">Branch details</span>
      <span className="actions">
        <button className="save" type="submit">Save</button>
      </span>
    </header>
    <section className="form-container">
      <Field component={InputField} id="name" name="name" label="Name" type="text" />
      <Field component={TextAreaField} id="contact" name="contact" label="Contact" />
      <Field component={TextAreaField} id="notes" name="notes" label="Notes" />
    </section>
  </form>
);

EditBranchForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ initialValues: getEditedBranch(state) });
export default connect(mapStateToProps)(reduxForm({
  form: 'branch',
  validate,
  onSubmit,
})(EditBranchForm));
