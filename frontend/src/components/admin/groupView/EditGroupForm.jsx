import React, { Component } from 'react';
import FormFieldLabel from '../../form/FormFieldLabel.jsx';
import groupValidator from '../../../services/groupValidator.js';

class EditGroupForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: props.group.id,
      name: props.group.name,
      description: props.group.description,
      invalidFields: [],
    };
    this.updateName = this.updateName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  getGroupDetails() {
    return this.state;
  }

  isValidationError(fieldName) {
    return this.state.invalidFields.includes(fieldName);
  }

  updateName(event) {
    this.setState({ name: event.target.value });
  }

  updateDescription(event) {
    this.setState({ description: event.target.value });
  }

  saveChanges() {
    const errors = groupValidator.isValid(this.getGroupDetails());
    this.setState({ invalidFields: errors });
    if (errors.length === 0) {
      this.props.onSuccess();
      this.props.onSave(this.getGroupDetails());
    }
  }

  render() {
    return (
      <section className="form-container">
        <h2>{this.props.title}</h2>
        <FormFieldLabel fieldName="groupName" isOptional={false} hasError={this.isValidationError('name')} />
        <input
          id="groupName"
          type="text"
          placeholder="e.g. Tuesday 4.30pm"
          defaultValue=""
          value={this.state.name}
          onChange={this.updateName}
        />
        <FormFieldLabel
          fieldName="groupDescription"
          isOptional={false}
          hasError={this.isValidationError('description')}
        />
        <textarea
          id="groupDescription"
          type="type"
          placeholder="Describe your group"
          defaultValue=""
          value={this.state.description}
          onChange={this.updateDescription}
        />
        <button className="save" onClick={this.saveChanges}>Save</button>
      </section>
    );
  }

}

EditGroupForm.propTypes = {
  title: React.PropTypes.string,
  group: React.PropTypes.object,
  onSuccess: React.PropTypes.func,
  onSave: React.PropTypes.func,
};

export default EditGroupForm;
