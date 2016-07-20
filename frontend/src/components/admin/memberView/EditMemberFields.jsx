import React from 'react';
import _ from 'lodash';
import FormFieldLabel from '../../form/FormFieldLabel.jsx';
import GroupCheckboxes from './GroupCheckboxes.jsx';
import moment from 'moment';

const EditMemberFields = ({ invalidFields, onChange, formValues, groups, selectedSection, onSelectSection }) => {
  const isValidationError = fieldName => _.indexOf(invalidFields, fieldName) > -1;

  const sections = {};
  const theSelectedSection = selectedSection === '' ? 'groups' : selectedSection;

  sections.groups = (
    <section>
      <FormFieldLabel fieldName="groups" isOptional={false} hasError={isValidationError('groups')} />
      <GroupCheckboxes onChange={onChange('groups')} groupOptions={groups} memberGroups={formValues.groups} />
    </section>
  );

  sections.notes = (
    <section id="pastoral-notes">
      <FormFieldLabel fieldName="pastoralNotes" isOptional hasError={isValidationError('pastoralNotes')} />
      <textarea
        defaultValue={formValues.pastoralNotes}
        onChange={onChange('pastoralNotes')}
        id="pastoralNotes"
        className="pastoralNotes"
      />
    </section>
  );

  sections.details = (
    <section id="details">
      <dl>
        <dt>Member since</dt>
        <dd>{moment(formValues.memberSince).format('YYYY/MM/DD')}</dd>
      </dl>

      <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={isValidationError('contactNumber')} />
      <input
        type="tel"
        defaultValue={formValues.contactNumber}
        onChange={onChange('contactNumber')}
        id="contactNumber"
        className="contactNumber"
      />

      <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={isValidationError('contactEmail')} />
      <input
        type="email"
        defaultValue={formValues.contactEmail}
        onChange={onChange('contactEmail')}
        id="contactEmail"
        className="contactEmail"
      />

      <fieldset className="field-pair">
        <legend>Member name</legend>
        <div className="sub-field">
          <FormFieldLabel
            fieldName="memberName"
            isOptional={false}
            hasError={isValidationError('memberName')}
          />
          <input
            type="text"
            defaultValue={formValues.memberName}
            onChange={onChange('memberName')}
            id="memberName" className="memberName"
          />
        </div>
        <div className="sub-field">
          <FormFieldLabel
            fieldName="memberLastName"
            isOptional={false}
            hasError={isValidationError('memberLastName')}
          />
          <input
            type="text"
            defaultValue={formValues.memberLastName}
            onChange={onChange('memberLastName')}
            id="memberLastName" className="memberLastName"
          />
        </div>
      </fieldset>

      <FormFieldLabel
        fieldName="memberBirthYear"
        isOptional={false}
        hasError={isValidationError('memberBirthYear')}
      />
      <input
        type="number"
        defaultValue={formValues.memberBirthYear}
        onChange={onChange('memberBirthYear')}
        placeholder="YYYY"
        min="1980"
        max="2016"
        id="memberBirthYear"
        className="memberBirthYear"
      />

      <dl>
        <dt>Additional info</dt>
        <dd className="textblock">{formValues.additionalInfo}</dd>
      </dl>
    </section>
  );

  return (
    <div>
      <ul className="details-section-selector">
        <li className={theSelectedSection === 'groups' ? 'selected' : ''} onClick={onSelectSection('groups')}>
          <span>Groups</span></li>
        <li className={theSelectedSection === 'details' ? 'selected' : ''} onClick={onSelectSection('details')}>
          <span>Details</span></li>
        <li className={theSelectedSection === 'notes' ? 'selected' : ''} onClick={onSelectSection('notes')}>
          <span>Pastoral notes</span>
        </li>
      </ul>
      {sections[theSelectedSection]}
    </div>
  );
};

EditMemberFields.propTypes = {
  invalidFields: React.PropTypes.array,
  onChange: React.PropTypes.func,
  formValues: React.PropTypes.object,
  groups: React.PropTypes.array,
  selectedSection: React.PropTypes.string,
  onSelectSection: React.PropTypes.func,
};

export default EditMemberFields;
