import React, { Component } from 'react';
import BranchFields from './BranchFields';
import branchValidator from '../../../services/branchValidator';

export default class EditGroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidFields: [],
      fieldValues: this.props.branch,
    };
    this.saveChanges = this.saveChanges.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(fieldName) {
    const editBranchComponent = this;

    return event => {
      const newValue = { [fieldName]: event.target.value };
      const newFieldValues = Object.assign({}, editBranchComponent.state.fieldValues, newValue);
      editBranchComponent.setState({ fieldValues: newFieldValues });
    };
  }

  isValidationError(fieldName) {
    return this.state.invalidFields.includes(fieldName);
  }

  saveChanges() {
    const branch = Object.assign({}, this.state.fieldValues);
    const errors = (branchValidator.isValid(branch));
    this.setState({ invalidFields: errors });
    if (errors.length === 0) {
      this.props.onSuccess();
      this.props.onSave(branch);
    }
  }

  render() {
    return (
      <section className="form-container">
        <header className="details-header">
          <span className="title">Edit branch</span>
          <span className="actions"><button className="save" onClick={this.saveChanges}>Save</button></span>
        </header>
        <BranchFields
          onChange={this.onChange}
          invalidFields={this.state.invalidFields}
          formValues={this.state.fieldValues}
        />
      </section>
    );
  }
}

EditGroupForm.propTypes = {
  branch: React.PropTypes.object.isRequired,
  onSuccess: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
};
