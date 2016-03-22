'use strict';
import React, {Component} from 'react';
import FormFieldLabel from '../form/FormFieldLabel.jsx';
import { ApplicationForm as Strings, Resources } from '../../config/strings.js';
import InlineError from '../form/InlineError.jsx';

const EditOrganiserFields = ({ invalidFields, onChange, formValues}) => {

    function isValidationError(fieldName) {
        return _.indexOf(invalidFields, fieldName) > -1;
    }

    return (
        <section>
            <FormFieldLabel fieldName="contactEmail" hasError={isValidationError('email')} />
            <input type="email" defaultValue={formValues.email} onChange={onChange('email')} id="email" className="email"/>
            <FormFieldLabel fieldName="name" hasError={isValidationError('name')} />
            <input type="text" defaultValue={formValues.name} onChange={onChange('name')} id="name" className="name"/>
            <FormFieldLabel fieldName="contactNumber" hasError={isValidationError('phoneNumber')} />
            <input type="tel" defaultValue={formValues.phoneNumber} onChange={onChange('phoneNumber')} id="contactNumber" className="contactNumber"/>
            <FormFieldLabel fieldName="password" hasError={isValidationError('password')} />
            <input type="password" onChange={onChange('password')} id="password" className="password"/>
            <FormFieldLabel fieldName="confirmedPassword" hasError={isValidationError('confirmedPassword')} />
            <input type="password" onChange={onChange('confirmedPassword')} id="confirmedPassword" className="password"/>
        </section>
    )
}

EditOrganiserFields.propTypes = {
    invalidFields: React.PropTypes.array,
    onChange: React.PropTypes.func,
    formValues: React.PropTypes.object,
};

export default EditOrganiserFields
