'use strict';
import React, {Component} from 'react';
import FormFieldLabel from './FormFieldLabel.jsx';
import { ApplicationForm as Strings, Resources } from '../../config/strings.js';
import InlineError from './InlineError.jsx';

const NewMemberFields = ({ invalidFields, labs, onChange, formValues }) => {

    function isValidationError(fieldName) {
        return _.indexOf(invalidFields, fieldName) > -1;
    }

    return (
        <div className="field-group">
            <FormFieldLabel fieldName="labSelection" isOptional={false} hasError={isValidationError('labSelection')} />

            <select defaultValue="" required id="labSelection" className="labSelection" onChange={onChange('labSelection')}>
                <option value="" disabled>{Strings.labPlaceholder}</option>
                {
                  labs.map(function(lab) {
                    return <option value={lab.id}>{lab.name}</option>;
                  })
                }
            </select>

            <fieldset className="field-pair">
              <legend>Contact name</legend>
              <div className="sub-field">

             <FormFieldLabel fieldName="contactName" isOptional={false} hasError={isValidationError('contactName')} />
                <input type="text" defaultValue={formValues.contactName} onChange={onChange('contactName')} id="contactName" className="contactName" />
              </div>
              <div className="sub-field">
               <FormFieldLabel fieldName="contactLastName" isOptional={false} hasError={isValidationError('contactLastName')} />
                <input type="text" defaultValue={formValues.contactLastName} onChange={onChange('contactLastName')} id="contactLastName" className="contactLastName" />
              </div>
            </fieldset>

            <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={isValidationError('contactNumber')} />
            <input type="tel" defaultValue={formValues.contactNumber} onChange={onChange('contactNumber')} id="contactNumber" className="contactNumber"/>

            <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={isValidationError('contactEmail')} />
            <input type="email" defaultValue={formValues.contactEmail} onChange={onChange('contactEmail')} id="contactEmail" className="contactEmail"/>

            <fieldset className="field-pair">
              <legend>Participant name</legend>
              <div className="sub-field">
                <FormFieldLabel fieldName="participantName" isOptional={false} hasError={isValidationError('participantName')} />
                <input type="text" defaultValue={formValues.participantName} onChange={onChange('participantName')} id="participantName" className="participantName"/>
              </div>
              <div className="sub-field">
                <FormFieldLabel fieldName="participantLastName" isOptional={false} hasError={isValidationError('participantLastName')} />
                <input type="text" defaultValue={formValues.participantLastName} onChange={onChange('participantLastName')} id="participantLastName" className="participantLastName"/>
              </div>
            </fieldset>

            <FormFieldLabel fieldName="participantBirthYear" isOptional={false} hasError={isValidationError('participantBirthYear')} />
            <aside>{ Strings.ageReminder }</aside>
            <input type="number" defaultValue={formValues.participantBirthYear} onChange={onChange('participantBirthYear')} placeholder="YYYY" min="1980" max="2016" id="participantBirthYear" className="participantBirthYear"/>

            <fieldset>
              <legend>What type of school does the participant attend?</legend>
              <InlineError errorFor={ isValidationError('schoolType') || isValidationError('schoolTypeOtherText') ? 'schoolType' : '' }/>
              <div><input type="radio" name="schoolType" onClick={onChange('schoolType')} id="schoolTypePrimary" value="Primary" /><label htmlFor="schoolTypePrimary">Primary</label></div>
              <div><input type="radio" name="schoolType" onClick={onChange('schoolType')} id="schoolTypeSecondary" value="Secondary"/><label htmlFor="schoolTypeSecondary">Secondary</label></div>
              <div><input type="radio" name="schoolType" onClick={onChange('schoolType')} id="schoolTypeOther" value="Other"/><label htmlFor="schoolTypeOther">Other</label>
              <input type="text" defaultValue={formValues.schoolType} onChange={onChange('schoolTypeOtherText')} id="schoolTypeOtherText" className="other-field"/>
              </div>
            </fieldset>

            <FormFieldLabel fieldName="additionalInfo" isOptional={true} hasError={isValidationError('additionalInfo')} />
            <aside>{ Strings.additionalInfoAside }</aside>
            <textarea defaultValue={formValues.additionalInfo} onChange={onChange('additionalInfo')} id="additionalInfo" className="additionalInfo"/>
          </div>
    )
}

NewMemberFields.propTypes = {
    invalidFields: React.PropTypes.array,
    labs: React.PropTypes.array,
    onChange: React.PropTypes.func,
    formValues: React.PropTypes.object
};

export default NewMemberFields
