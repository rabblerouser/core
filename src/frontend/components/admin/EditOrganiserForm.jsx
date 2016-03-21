'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import EditOrganiserFields from './EditOrganiserFields.jsx';
import organiserValidator from '../../services/organiserValidator';

export default class EditOrganiserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.organiser.id,
            invalidFields: [],
            fieldValues: props.organiser,
            selectedSection: ''
        };
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    saveChanges() {
        let organiser = Object.assign({}, this.props.organiser, this.state.fieldValues);
        let errors = organiserValidator.isValid(organiser);
        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSuccess();
            this.props.onSave(organiser);
        }
    }

    onChange(fieldName) {
        let editOrganiserComponent = this;

        return function(event) {
            let newValue;
            switch(event.target.type) {
                case 'checkbox':
                    newValue = {[fieldName] : editOrganiserComponent.checkboxChange(fieldName, event.target.value, event.target.checked)};
                    break;
                default:
                    newValue = {[fieldName] : event.target.value};
                    break;
            }
            let newFieldValues = Object.assign({}, editOrganiserComponent.state.fieldValues, newValue);
            editOrganiserComponent.setState({
                fieldValues: newFieldValues
            });
        };
    }

    checkboxChange(fieldName, fieldValue, isChecked) {
        return isChecked;
    }

    render() {
        return (
            <section className="form-container">
                <header className="details-header">
                    <span className='title'>
                        Edit details for
                        <br />
                        {this.props.organiser.email}
                    </span>
                    <span className='actions'>
                        <button onClick={this.saveChanges.bind(this)}>Save</button>
                    </span>
                </header>
                <EditOrganiserFields onChange={this.onChange.bind(this)}
                              invalidFields={this.state.invalidFields}
                              groups={this.props.organiser.allGroups}
                              formValues={this.state.fieldValues}
                />
            </section>
        )
    }
}
