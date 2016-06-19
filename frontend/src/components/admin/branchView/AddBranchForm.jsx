import React, { Component } from 'react';
import AddBranchFields from './AddBranchFields.jsx';
import branchValidator from '../../../services/branchValidator';

export default class AddBranchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidFields: [],
      fieldValues: {},
    };
    this.saveChanges = this.saveChanges.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(fieldName) {
    const addBranchComponent = this;

    return event => {
      const newValue = { [fieldName]: event.target.value };
      const newFieldValues = Object.assign({}, addBranchComponent.state.fieldValues, newValue);
      addBranchComponent.setState({ fieldValues: newFieldValues });
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
          <span className="title">
            Add new branch
          </span>
          <span className="actions">
            <button className="save" onClick={this.saveChanges}>Save</button>
          </span>
        </header>
        <AddBranchFields
          onChange={this.onChange}
          invalidFields={this.state.invalidFields}
          formValues={this.state.fieldValues}
        />
      </section>
    );
  }
}

AddBranchForm.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  onSuccess: React.PropTypes.func.isRequired,
};
