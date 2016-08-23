import React from 'react';
import { connect } from 'react-redux';

import validate from './branchValidator';
import { branchCreateRequested } from '../../../actions/branchActions';

import { Field, reduxForm } from 'redux-form';
import InputField from '../../common/forms/InputField';
import TextAreaField from '../../common/forms/TextAreaField';

const onSubmit = (data, dispatch) => new Promise((resolve, reject) => {
  dispatch(branchCreateRequested(data, resolve, reject));
});

let AddBranchForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <header className="details-header">
      <span className="title">Add new branch</span>
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

AddBranchForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
};

AddBranchForm = reduxForm({
  form: 'branch',
  validate,
  onSubmit,
})(AddBranchForm);

export default connect(() => ({}), { branchCreateRequested })(AddBranchForm);
