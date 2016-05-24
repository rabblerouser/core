import React, { Component } from 'react';
import _ from 'underscore';
import EditMemberFields from './EditMemberFields.jsx';
import memberValidator from '../../../services/memberValidator';
import UserMessageView from '../UserMessageView.jsx';

export default class EditMemberForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.participant.id,
      invalidFields: [],
      selectedSection: '',
      userMessages: [],
      pageErrors: [],
      fieldValues: this.mapParticipantToFields(props.participant),
    };
  }

  mapParticipantToFields(participant) {
    if (participant.schoolType === 'Primary' || participant.schoolType === 'Secondary') {
      return Object.assign({}, participant);
    }
    return Object.assign({}, participant, { schoolTypeOtherText: participant.schoolType, schoolType: 'Other' });
  }

  getGroupDetails() {
    return this.state;
  }

  isValidationError(fieldName) {
    return this.state.invalidFields.includes(fieldName);
  }

  getSchoolType(fieldValues) {
    if (fieldValues.schoolType === 'Other') {
      return fieldValues.schoolTypeOtherText;
    }
    return fieldValues.schoolType;
  }

  saveChanges() {
    const member = Object.assign(
      {},
      this.props.participant,
      this.state.fieldValues, { schoolType: this.getSchoolType(this.state.fieldValues) }
    );
    const errors = memberValidator.isValid(member);
    this.setState({ invalidFields: errors });
    if (errors.length === 0) {
      this.props.onSuccess();
      this.props.onSave(member);
    } else {
      this.setState({ pageErrors: ['Your updates could not be saved. Please check the details.'] });
    }
  }

  checkboxChange(fieldName, fieldValue, isChecked) {
    let newValues = this.state.fieldValues[fieldName].slice(0);
    if (isChecked) {
      newValues.push(fieldValue);
    } else {
      newValues = _.without(newValues, fieldValue);
    }
    return newValues;
  }

  onChange(fieldName) {
    const editMemberComponent = this;

    return event => {
      const newValue = {};
      switch (event.target.type) {
        case 'checkbox':
          newValue[fieldName] = editMemberComponent.checkboxChange(fieldName, event.target.value, event.target.checked);
          break;
        default:
          newValue[fieldName] = event.target.value;
          break;
      }
      const newFieldValues = Object.assign({}, editMemberComponent.state.fieldValues, newValue);
      editMemberComponent.setState({ fieldValues: newFieldValues });
    };
  }

  onSelect(section) {
    return () => {
      this.setState({ selectedSection: section });
    };
  }

  render() {
    return (
      <section className="form-container">
        <header className="details-header">
          <span className="title">
            {`${this.props.participant.participantName} ${this.props.participant.participantLastName}`}
          </span>
          <span className="actions"><button className="save" onClick={this.saveChanges.bind(this)}>Save</button></span>
        </header>
        <UserMessageView
          messages={this.state.userMessages}
          errors={this.state.pageErrors}
        />
        <EditMemberFields
          onChange={this.onChange.bind(this)}
          invalidFields={this.state.invalidFields}
          groups={this.props.participant.allGroups}
          formValues={this.state.fieldValues}
          selectedSection={this.state.selectedSection}
          onSelectSection={this.onSelect.bind(this)}
        />
      </section>
    );
  }
}
