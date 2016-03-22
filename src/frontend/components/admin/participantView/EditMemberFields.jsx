'use strict';
import React, {Component} from 'react';
import FormFieldLabel from '../../form/FormFieldLabel.jsx';
import { ApplicationForm as Strings, Resources } from '../../../config/strings.js';
import InlineError from '../../form/InlineError.jsx';
import GroupCheckboxes from './GroupCheckboxes.jsx';


const EditMemberFields = ({ invalidFields, onChange, formValues, groups, selectedSection, onSelectSection }) => {

    function isValidationError(fieldName) {
        return _.indexOf(invalidFields, fieldName) > -1;
    }

    let sections = {};
    if(selectedSection === '') {
        selectedSection = 'groups';
    }

    sections.groups = (
        <section>
            <FormFieldLabel fieldName="groups" isOptional={false} hasError={isValidationError('groups')} />
            <GroupCheckboxes onChange={onChange('groups')}
                groupOptions={groups}
                participantGroups={formValues.groups} />
        </section>
    );

    sections.notes = (
        <section id="pastoral-notes">
            <FormFieldLabel fieldName="pastoralNotes" isOptional={true} hasError={isValidationError('pastoralNotes')} />
            <textarea defaultValue={formValues.pastoralNotes} onChange={onChange('pastoralNotes')} id="pastoralNotes" className="pastoralNotes"/>
        </section>
    );

    sections.details = (
        <section id="details">
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
            <input type="number" defaultValue={formValues.participantBirthYear} onChange={onChange('participantBirthYear')} placeholder="YYYY" min="1980" max="2016" id="participantBirthYear" className="participantBirthYear"/>

            <fieldset>
              <legend>School type</legend>
              <InlineError errorFor={ isValidationError('schoolType') || isValidationError('schoolTypeOtherText') ? 'schoolType' : '' }/>
              <div><input type="radio" defaultChecked={formValues.schoolType === 'Primary'} name="schoolType" onClick={onChange('schoolType')} id="schoolTypePrimary" value="Primary" /><label htmlFor="schoolTypePrimary">Primary</label></div>
              <div><input type="radio" defaultChecked={formValues.schoolType === 'Secondary'} name="schoolType" onClick={onChange('schoolType')} id="schoolTypeSecondary" value="Secondary"/><label htmlFor="schoolTypeSecondary">Secondary</label></div>
              <div><input type="radio" defaultChecked={formValues.schoolType !== 'Primary' && formValues.schoolType !== 'Secondary'} name="schoolType" onClick={onChange('schoolType')} id="schoolTypeOther" value="Other"/><label htmlFor="schoolTypeOther">Other</label>
              <input type="text" defaultValue={(formValues.schoolType !== 'Primary' && formValues.schoolType !== 'Secondary') ? formValues.schoolType : ''} onChange={onChange('schoolTypeOtherText')} id="schoolTypeOtherText" className="other-field"/>
              </div>
            </fieldset>

            <FormFieldLabel fieldName="additionalInfo" isOptional={true} hasError={isValidationError('additionalInfo')} />
            <textarea defaultValue={formValues.additionalInfo} onChange={onChange('additionalInfo')} id="additionalInfo" className="additionalInfo"/>
        </section>
    );

    return (
        <div>
            <ul className="details-section-selector">
                <li className={selectedSection === 'groups' ? 'selected':''} onClick={onSelectSection('groups')}><span>Groups</span></li>
                <li className={selectedSection === 'details' ? 'selected':''} onClick={onSelectSection('details')}><span>Details</span></li>
                <li className={selectedSection === 'notes' ? 'selected':''} onClick={onSelectSection('notes')}><span>Pastoral notes</span></li>
            </ul>
            {sections[selectedSection]}
          </div>
    )
}

EditMemberFields.propTypes = {
    invalidFields: React.PropTypes.array,
    onChange: React.PropTypes.func,
    formValues: React.PropTypes.object,
    groups: React.PropTypes.array,
    selectedSection: React.PropTypes.string
};

export default EditMemberFields
