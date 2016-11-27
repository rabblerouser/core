import React from 'react';
import _ from 'lodash';
import { FormFieldLabel } from '../common/forms/';
import GroupCheckboxes from './GroupCheckboxes';
import moment from 'moment';

const EditMemberFields = ({ invalidFields, onChange, formValues, groups, selectedSection, onSelectSection,
                            addressEnabled = customisation.addressEnabled }) => {
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
    <section id="notes">
      <FormFieldLabel fieldName="notes" isOptional hasError={isValidationError('notes')} />
      <textarea
        defaultValue={formValues.notes}
        onChange={onChange('notes')}
        id="notes"
        className="notes"
      />
    </section>
  );

  sections.details = (
    <section id="details">
      <dl>
        <dt>Member since</dt>
        <dd>{moment(formValues.memberSince).format('YYYY/MM/DD')}</dd>
      </dl>

      <fieldset className="field-pair">
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

      <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={isValidationError('contactEmail')} />
      <input
        type="email"
        defaultValue={formValues.contactEmail}
        onChange={onChange('contactEmail')}
        id="contactEmail"
        className="contactEmail"
      />

      <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={isValidationError('contactNumber')} />
      <input
        type="tel"
        defaultValue={formValues.contactNumber}
        onChange={onChange('contactNumber')}
        id="contactNumber"
        className="contactNumber"
      />

      {addressEnabled &&
        <fieldset>
          <FormFieldLabel fieldName="address" isOptional={false} hasError={isValidationError('address')} />
          <input
            type="text"
            defaultValue={formValues.address}
            onChange={onChange('address')}
            id="address"
            className="address"
          />

          <FormFieldLabel fieldName="suburb" isOptional={false} hasError={isValidationError('suburb')} />
          <input
            type="text"
            defaultValue={formValues.suburb}
            onChange={onChange('suburb')}
            id="suburb"
            className="suburb"
          />

          <FormFieldLabel fieldName="postcode" isOptional={false} hasError={isValidationError('postcode')} />
          <input
            type="text"
            defaultValue={formValues.postcode}
            onChange={onChange('postcode')}
            id="postcode"
            className="postcode"
          />

          <FormFieldLabel fieldName="state" isOptional={false} hasError={isValidationError('state')} />
          <input
            type="text"
            defaultValue={formValues.state}
            onChange={onChange('state')}
            id="state"
            className="state"
          />

          <FormFieldLabel fieldName="country" isOptional={false} hasError={isValidationError('country')} />
          <input
            type="text"
            defaultValue={formValues.country}
            onChange={onChange('country')}
            id="country"
            className="country"
          />
        </fieldset>
      }

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
          <span>Notes</span>
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
  addressEnabled: React.PropTypes.bool,
};

export default EditMemberFields;
