'use strict';
import React, {Component} from 'react';
import FormFieldLabel from '../form/FormFieldLabel.jsx';
import { ApplicationForm as Strings, Resources } from '../../config/strings.js';
import InlineError from '../form/InlineError.jsx';

const EditOrganiserFields = ({ invalidFields, onChange, formValues}) => {

    function isValidationError(fieldName) {
        return _.indexOf(invalidFields, fieldName) > -1;
    }

    function isChangingPassword() {
        return formValues.isChangingPassword;
    }

    return (
        <section>
            <FormFieldLabel fieldName="name" isOptional={true} hasError={isValidationError('name')} />
            <input type="text" defaultValue={formValues.name} onChange={onChange('name')} id="name" className="name"/>
            <FormFieldLabel fieldName="contactNumber" isOptional={true} hasError={isValidationError('phoneNumber')} />
            <input type="tel" defaultValue={formValues.phoneNumber} onChange={onChange('phoneNumber')} id="contactNumber" className="contactNumber"/>
            <FormFieldLabel fieldName="password" hasError={isValidationError('password')} />
            <input type="checkbox" defaultValue={false} onChange={onChange('isChangingPassword')} id="isChangingPassword"/>
            <label htmlFor="changePassword">Change password</label>
            <input type="password" disabled={!isChangingPassword()} defaultValue={''} onChange={onChange('password')} id="password" className="password"/>
        </section>
    )
}

EditOrganiserFields.propTypes = {
    invalidFields: React.PropTypes.array,
    onChange: React.PropTypes.func,
    formValues: React.PropTypes.object,
};

export default EditOrganiserFields
