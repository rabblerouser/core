import React from 'react';
import FormFieldLabel from './FormFieldLabel.jsx';
import { ApplicationForm as Strings } from '../../config/strings.js';
import _ from 'underscore';

const NewMemberFields = props => {
  function isValidationError(fieldName) {
    return _.indexOf(props.invalidFields, fieldName) > -1;
  }

  return (
    <div className="field-group">
      <FormFieldLabel fieldName="branchSelection" isOptional={false} hasError={isValidationError('branchSelection')} />

      <select
        defaultValue=""
        required id="branchSelection"
        className="branchSelection"
        onChange={props.onChange('branchSelection')}
      >
        <option value="" disabled>{Strings.branchPlaceholder}</option>
        {
          _.sortBy(props.branches, 'name').map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))
        }
      </select>

      <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={isValidationError('contactNumber')} />
      <input
        type="tel"
        defaultValue={props.formValues.contactNumber}
        onChange={props.onChange('contactNumber')}
        id="contactNumber"
        className="contactNumber"
      />

      <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={isValidationError('contactEmail')} />
      <input
        type="email"
        defaultValue={props.formValues.contactEmail}
        onChange={props.onChange('contactEmail')}
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
            defaultValue={props.formValues.memberName}
            onChange={props.onChange('memberName')}
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
            defaultValue={props.formValues.memberLastName}
            onChange={props.onChange('memberLastName')}
            id="memberLastName" className="memberLastName"
          />
        </div>
      </fieldset>

      <FormFieldLabel
        fieldName="memberBirthYear"
        isOptional={false}
        hasError={isValidationError('memberBirthYear')}
      />
      <aside>{Strings.ageReminder}</aside>
      <input
        type="number"
        defaultValue={props.formValues.memberBirthYear}
        onChange={props.onChange('memberBirthYear')}
        placeholder="YYYY"
        min="1980"
        max="2016"
        id="memberBirthYear"
        className="memberBirthYear"
      />

      <FormFieldLabel fieldName="additionalInfo" isOptional hasError={isValidationError('additionalInfo')} />
      <aside>{Strings.additionalInfoAside}</aside>
      <textarea
        defaultValue={props.formValues.additionalInfo}
        onChange={props.onChange('additionalInfo')}
        id="additionalInfo"
        className="additionalInfo"
      />
    </div>
  );
};

NewMemberFields.propTypes = {
  invalidFields: React.PropTypes.array,
  branches: React.PropTypes.array,
  onChange: React.PropTypes.func,
  formValues: React.PropTypes.object,
};

export default NewMemberFields;
