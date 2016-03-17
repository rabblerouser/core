import React, {Component} from 'react';
import FormFieldLabel from '../form/FormFieldLabel.jsx';
import { ApplicationForm as Strings, Resources } from '../../config/strings.js';
import InlineError from '../form/InlineError.jsx';

export default class MemberDetails extends Component {


    constructor(props) {
        super(props);
        this.isValidationError = this.isValidationError.bind(this);
        this.render = this.render.bind(this);
    }

    isValidationError(fieldName) {
      return _.indexOf(this.props.invalidFields, fieldName) > -1;
    }

    render() {
        return (
            <div className="field-group">
                <FormFieldLabel fieldName="labSelection" isOptional={false} hasError={this.isValidationError('labSelection')} />

                <select ref="labSelection" defaultValue="" required id="labSelection" className="labSelection" onChange={this.props.onChange('labSelection')}>
                    <option value="" disabled>{Strings.labPlaceholder}</option>
                    {
                      this.props.labs.map(function(lab) {
                        return <option value={lab.id}>{lab.name}</option>;
                      })
                    }
                </select>

                <fieldset className="field-pair">
                  <legend>Parent / Guardian name</legend>
                  <div className="sub-field">

                 <FormFieldLabel fieldName="contactName" isOptional={false} hasError={this.isValidationError('contactName')} />
                    <input type="text" defaultValue={this.props.formValues.contactName} onChange={this.props.onChange('contactName')} id="contactName" className="contactName" />
                  </div>
                  <div className="sub-field">
                   <FormFieldLabel fieldName="contactLastName" isOptional={false} hasError={this.isValidationError('contactLastName')} />
                    <input type="text" defaultValue={this.props.formValues.contactLastName} onChange={this.props.onChange('contactLastName')} id="contactLastName" className="contactLastName" />
                  </div>
                </fieldset>

                <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={this.isValidationError('contactNumber')} />
                <input type="tel" defaultValue={this.props.formValues.contactNumber} onChange={this.props.onChange('contactNumber')} id="contactNumber" className="contactNumber"/>

                <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={this.isValidationError('contactEmail')} />
                <input type="email" defaultValue={this.props.formValues.contactEmail} onChange={this.props.onChange('contactEmail')} id="contactEmail" className="contactEmail"/>

                <fieldset className="field-pair">
                  <legend>Participant name</legend>
                  <div className="sub-field">
                    <FormFieldLabel fieldName="participantName" isOptional={false} hasError={this.isValidationError('participantName')} />
                    <input type="text" defaultValue={this.props.formValues.participantName} onChange={this.props.onChange('participantName')} id="participantName" className="participantName"/>
                  </div>
                  <div className="sub-field">
                    <FormFieldLabel fieldName="participantLastName" isOptional={false} hasError={this.isValidationError('participantLastName')} />
                    <input type="text" defaultValue={this.props.formValues.participantLastName} onChange={this.props.onChange('participantLastName')} id="participantLastName" className="participantLastName"/>
                  </div>
                </fieldset>

                <FormFieldLabel fieldName="participantBirthYear" isOptional={false} hasError={this.isValidationError('participantBirthYear')} />
                <aside>{ Strings.ageReminder }</aside>
                <input type="number" defaultValue={this.props.formValues.participantBirthYear} onChange={this.props.onChange('participantBirthYear')} placeholder="YYYY" min="1980" max="2016" id="participantBirthYear" className="participantBirthYear"/>

                <fieldset>
                  <legend>What type of school does the participant attend?</legend>
                  <InlineError errorFor={ this.isValidationError('schoolType') ? 'schoolType' : '' }/>
                  <div><input type="radio" name="schoolType" onClick={this.props.onChange('schoolType')} id="schoolTypePrimary" value="Primary" /><label htmlFor="schoolTypePrimary">Primary</label></div>
                  <div><input type="radio" name="schoolType" onClick={this.props.onChange('schoolType')} id="schoolTypeSecondary" value="Secondary"/><label htmlFor="schoolTypeSecondary">Secondary</label></div>
                  <div><input type="radio" name="schoolType" onClick={this.props.onChange('schoolType')} id="schoolTypeOther" value="Other"/><label htmlFor="schoolTypeOther">Other</label>
                  <input type="text" defaultValue={this.props.formValues.schoolType} onChange={this.props.onChange('schoolTypeOtherText')} id="schoolTypeOtherText" className="other-field"/>
                  </div>
                </fieldset>

                <FormFieldLabel fieldName="additionalInfo" isOptional={true} hasError={this.isValidationError('additionalInfo')} />
                <aside>{ Strings.additionalInfoAside }</aside>
                <textarea defaultValue={this.props.formValues.additionalInfo} onChange={this.props.onChange('additionalInfo')} id="additionalInfo" className="additionalInfo"/>
              </div>
        )
    }
}

