import React from 'react';
import FormFieldLabel from './FormFieldLabel.jsx';
import { ApplicationForm as Strings } from '../../config/strings.js';
import InlineError from './InlineError.jsx';
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

      <fieldset className="field-pair">
        <legend>Contact name</legend>
        <div className="sub-field">

          <FormFieldLabel fieldName="contactName" isOptional={false} hasError={isValidationError('contactName')} />
          <input
            type="text"
            defaultValue={props.formValues.contactName}
            onChange={props.onChange('contactName')}
            id="contactName"
            className="contactName"
          />
        </div>
        <div className="sub-field">
          <FormFieldLabel
            fieldName="contactLastName" isOptional={false}
            hasError={isValidationError('contactLastName')}
          />
          <input
            type="text"
            defaultValue={props.formValues.contactLastName}
            onChange={props.onChange('contactLastName')}
            id="contactLastName"
            className="contactLastName"
          />
        </div>
      </fieldset>

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

      <fieldset>
        <legend>What type of school does the member attend?</legend>
        <InlineError
          errorFor={isValidationError('schoolType') || isValidationError('schoolTypeOtherText') ? 'schoolType' : ''}
        />
        <div>
          <input
            type="radio"
            name="schoolType"
            onClick={props.onChange('schoolType')}
            id="schoolTypePrimary"
            value="Primary"
          />
          <label htmlFor="schoolTypePrimary">Primary</label>
        </div>
        <div>
          <input
            type="radio"
            name="schoolType"
            onClick={props.onChange('schoolType')}
            id="schoolTypeSecondary"
            value="Secondary"
          />
          <label htmlFor="schoolTypeSecondary">Secondary</label>
        </div>
        <div>
          <input
            type="radio"
            name="schoolType"
            onClick={props.onChange('schoolType')}
            id="schoolTypeOther"
            value="Other"
          />
          <label htmlFor="schoolTypeOther">Other</label>
          <input
            type="text"
            defaultValue={props.formValues.schoolType}
            onChange={props.onChange('schoolTypeOtherText')}
            id="schoolTypeOtherText"
            className="other-field"
          />
        </div>
      </fieldset>

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
