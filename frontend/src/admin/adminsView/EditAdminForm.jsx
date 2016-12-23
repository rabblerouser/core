import React, { Component } from 'react';
import EditAdminFields from './EditAdminFields';
import validator from '../services/adminValidator';

export default class EditAdminForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: props.admin.id,
      invalidFields: [],
      fieldValues: props.admin,
    };
    this.saveChanges = this.saveChanges.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(fieldName) {
    const editAdminComponent = this;

    return event => {
      const newValue = { [fieldName]: event.target.value };
      const newFieldValues = Object.assign({}, editAdminComponent.state.fieldValues, newValue);
      editAdminComponent.setState({ fieldValues: newFieldValues });
    };
  }

  isNewUser() {
    return this.props.admin === {};
  }

  passwordChanged() {
    return this.state.fieldValues.password;
  }

  passwordConfirmedTest() {
    return this.state.fieldValues.confirmedPassword !==
    this.state.fieldValues.password ? ['confirmedPassword'] : [];
  }

  saveChanges() {
    const admin = Object.assign({}, this.props.admin, this.state.fieldValues);
    let errors;
    if (this.passwordChanged()) {
      errors = (validator.isValid(admin));
      errors = errors.concat(this.passwordConfirmedTest());
    } else {
      errors = (validator.isValidWithoutPassword(admin));
    }

    this.setState({ invalidFields: errors });
    if (errors.length === 0) {
      this.props.onSuccess();
      this.props.onSave(admin);
    }
  }

  isValidationError(fieldName) {
    return this.state.invalidFields.includes(fieldName);
  }

  render() {
    return (
      <section className="form-container">
        <header className="details-header">
          <span className="title">
            Edit details for {this.props.admin.email}
          </span>
          <span className="actions">
            <button className="save" onClick={this.saveChanges}>Save</button>
          </span>
        </header>
        <EditAdminFields
          onChange={this.onChange}
          invalidFields={this.state.invalidFields}
          formValues={this.state.fieldValues}
        />
      </section>
    );
  }
}

EditAdminForm.propTypes = {
  admin: React.PropTypes.object.isRequired,
  onSuccess: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
};
