import React, { Component } from 'react';
import _ from 'underscore';
import EditMemberFields from './EditMemberFields';
import memberValidator from '../../services/memberValidator';
import UserMessageView from '../UserMessageView';

const ADDRESS_FIELD_NAMES = ['address', 'suburb', 'state', 'postcode', 'country'];

export default class EditMemberForm extends Component {

  constructor(props) {
    super(props);

    if (props.addressEnabled === undefined) {
      this.addressEnabled = customisation.addressEnabled;
    } else {
      this.addressEnabled = props.addressEnabled;
    }

    this.state = {
      id: props.member.id,
      invalidFields: [],
      selectedSection: '',
      userMessages: [],
      pageErrors: [],
      fieldValues: this.mapMemberToFields(props.member),
    };
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
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

  mapMemberToFields(member) {
    const fields = Object.assign({}, member);
    if (this.addressEnabled) {
      if (member.postalAddress) {
        Object.assign(fields, member.postalAddress);
      } else {
        ADDRESS_FIELD_NAMES.forEach(name => { fields[name] = ''; });
      }
    }
    return fields;
  }

  mapFieldsToMember(fields) {
    const member = { ...fields };

    if (this.addressEnabled) {
      const postalAddress = {
        address: fields.address,
        suburb: fields.suburb,
        state: fields.state,
        postcode: fields.postcode,
        country: fields.country,
      };
      const allEmpty = ADDRESS_FIELD_NAMES.every(
        field => (!postalAddress[field]));
      if (allEmpty) {
        member.postalAddress = null;
      } else {
        member.postalAddress = postalAddress;
      }
    }
    delete member.address;
    delete member.suburb;
    delete member.state;
    delete member.postcode;
    delete member.country;

    return member;
  }

  isValidationError(fieldName) {
    return this.state.invalidFields.includes(fieldName);
  }

  saveChanges() {
    const newMemberValues = this.mapFieldsToMember(this.state.fieldValues);
    const member = Object.assign({}, this.props.member, newMemberValues);
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

  render() {
    return (
      <section className="form-container">
        <header className="details-header">
          <span className="title">
            {`${this.props.member.memberName} ${this.props.member.memberLastName}`}
          </span>
          <span className="actions"><button className="save" onClick={this.saveChanges}>Save</button></span>
        </header>
        <UserMessageView
          messages={this.state.userMessages}
          errors={this.state.pageErrors}
        />
        <EditMemberFields
          onChange={this.onChange}
          invalidFields={this.state.invalidFields}
          groups={this.props.member.allGroups}
          formValues={this.state.fieldValues}
          selectedSection={this.state.selectedSection}
          onSelectSection={this.onSelect}
        />
      </section>
    );
  }
}

EditMemberForm.propTypes = {
  member: React.PropTypes.object.isRequired,
  onSuccess: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  addressEnabled: React.PropTypes.bool,
};
