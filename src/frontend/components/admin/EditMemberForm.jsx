'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import EditMemberFields from './EditMemberFields.jsx';
import memberValidator from '../../services/memberValidator';

export default class EditMemberForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.participant.id,
            invalidFields: [],
            fieldValues: props.participant
        };
    }

    getGroupDetails() {
        return this.state;
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    saveChanges() {
        let participant = Object.assign({}, this.props.participant, this.state.fieldValues);
        let errors = memberValidator.isValid(participant);
        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSuccess();
            this.props.onSave(participant);
        }
    }

    checkboxChange(fieldName, fieldValue, isChecked) {
        let newValues = this.state.fieldValues[fieldName].slice(0);
        if(isChecked) {
            newValues.push(fieldValue);
        } else {
            newValues = _.without(newValues, fieldValue);
        }
        return newValues;
    }

    onChange(fieldName) {
        let editMemberComponent = this;

        return function(event) {
            let newValue;
            switch(event.target.type) {
                case 'checkbox':
                    newValue = {[fieldName] : editMemberComponent.checkboxChange(fieldName, event.target.value, event.target.checked)};
                    break;
                default:
                    newValue = {[fieldName] : event.target.value};
                    break;
            }
            let newFieldValues = Object.assign({}, editMemberComponent.state.fieldValues, newValue);
            editMemberComponent.setState({
                fieldValues: newFieldValues
            });
        };
    }

    render() {
        return (
            <section className="form-container">
                <EditMemberFields onChange={this.onChange.bind(this)}
                              invalidFields={this.state.invalidFields}
                              groups={this.props.participant.allGroups}
                              formValues={this.props.participant}
                />
                <button onClick={this.saveChanges.bind(this)}>Save</button>
            </section>
        )
    }
}
