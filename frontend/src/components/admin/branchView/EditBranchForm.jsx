import React from 'react';
import { connect } from 'react-redux';

import validate from './branchValidator';
import { getSelectedBranch } from '../../../reducers/branchReducers';
import { branchUpdateRequested } from '../../../actions/branchActions';

import { Field, reduxForm } from 'redux-form';
import InputField from '../../common/forms/InputField';
import TextAreaField from '../../common/forms/TextAreaField';

const onSubmit = (data, dispatch) => new Promise((resolve, reject) => {
  dispatch(branchUpdateRequested(data, resolve, reject));
});

let EditBranchForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <header className="details-header">
      <span className="title">Edit branch</span>
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
  branch: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
};

EditBranchForm = reduxForm({
  form: 'branch',
  validate,
  onSubmit,
})(EditBranchForm);

const mapStateToProps = state => ({
  initialValues: getSelectedBranch(state),
});

export default connect(mapStateToProps, { branchUpdateRequested })(EditBranchForm);
