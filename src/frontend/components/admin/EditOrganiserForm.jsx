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
            fieldValues: props.organiser
        };
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    isNewUser() {
        return this.props.organiser === {};
    }

    passwordChanged() {
        return this.state.fieldValues.password;
    }

    passwordConfirmedTest() {
        return this.state.fieldValues.confirmedPassword !==
            this.state.fieldValues.password ? ['confirmedPassword'] : [];
    }

    saveChanges() {
        let organiser = Object.assign({}, this.props.organiser, this.state.fieldValues);
        let errors;
        if(this.passwordChanged()) {

            errors = (organiserValidator.isValid(organiser));
            errors = errors.concat(this.passwordConfirmedTest());
        } else {
            errors = (organiserValidator.isValidWithoutPassword(organiser));
        }

        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSuccess();
            this.props.onSave(organiser);
        }
    }

    onChange(fieldName) {
        let editOrganiserComponent = this;

        return function(event) {
            let newValue = {[fieldName] : event.target.value};
            let newFieldValues = Object.assign({}, editOrganiserComponent.state.fieldValues, newValue);
            editOrganiserComponent.setState({
                fieldValues: newFieldValues
            });
        };
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
                              formValues={this.state.fieldValues}
                />
            </section>
        )
    }
}
