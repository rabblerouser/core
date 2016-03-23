'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import AddAdminFields from './AddAdminFields.jsx';
import validator from '../../../services/adminValidator';

export default class AddAdminForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invalidFields: [],
            fieldValues: {}
        };
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    isNewUser() {
        return this.props.admin === {};
    }

    passwordConfirmedTest() {
        return this.state.fieldValues.confirmedPassword !==
            this.state.fieldValues.password ? ['confirmedPassword'] : [];
    }

    saveChanges() {
        let organiser = Object.assign({}, this.state.fieldValues);
        let errors = (validator.isValid(admin));
        errors = errors.concat(this.passwordConfirmedTest());
        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSuccess();
            this.props.onSave(organiser);
        }
    }

    onChange(fieldName) {
        let addAdminComponent = this;

        return function(event) {
            let newValue = {[fieldName] : event.target.value};
            let newFieldValues = Object.assign({}, addAdminComponent.state.fieldValues, newValue);
            addAdminComponent.setState({
                fieldValues: newFieldValues
            });
        };
    }

    render() {
        return (
            <section className="form-container">
                <header className="details-header">
                    <span className='title'>
                        Add new
                    </span>
                    <span className='actions'>
                        <button className="save" onClick={this.saveChanges.bind(this)}>Save</button>
                    </span>
                </header>
                <AddAdminFields onChange={this.onChange.bind(this)}
                              invalidFields={this.state.invalidFields}
                              formValues={this.state.fieldValues}
                />
            </section>
        )
    }
}
