import React, { Component } from 'react';
import AddLabFields from './AddLabFields.jsx';
import labValidator from '../../../services/labValidator';

export default class AddLabForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidFields: [],
      fieldValues: {},
    };
  }

  isValidationError(fieldName) {
    return this.state.invalidFields.includes(fieldName);
  }

  saveChanges() {
    const lab = Object.assign({}, this.state.fieldValues);
    const errors = (labValidator.isValid(lab));
    this.setState({ invalidFields: errors });
    if (errors.length === 0) {
      this.props.onSuccess();
      this.props.onSave(lab);
    }
  }

  onChange(fieldName) {
    const addLabComponent = this;

    return event => {
      const newValue = { [fieldName]: event.target.value };
      const newFieldValues = Object.assign({}, addLabComponent.state.fieldValues, newValue);
      addLabComponent.setState({ fieldValues: newFieldValues });
    };
  }

  render() {
    return (
      <section className="form-container">
        <header className="details-header">
          <span className="title">
            Add new lab
          </span>
          <span className="actions">
            <button className="save" onClick={this.saveChanges.bind(this)}>Save</button>
          </span>
        </header>
        <AddLabFields
          onChange={this.onChange.bind(this)}
          invalidFields={this.state.invalidFields}
          formValues={this.state.fieldValues}
        />
      </section>
    );
  }
}
