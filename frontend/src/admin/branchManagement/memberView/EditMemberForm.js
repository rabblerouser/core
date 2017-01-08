import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import { Button } from '../../common';
import validate from './memberValidator';
import { SelectField, InputField, TextAreaField } from '../../common/forms';
import { getSelectedMember } from './reducers';
import { getGroups } from '../groupView';
import { memberUpdateRequested as update, finishEditMember } from './actions';

export const EditMemberForm = ({
  handleSubmit,
  addressEnabled = customisation.addressEnabled,
  groupOptions,
  memberSince,
}) => (
  <form onSubmit={handleSubmit}>
    <section className="form-container">
      <header className="details-header">
        <span className="title">Member details</span>
        <span className="actions">
          <Button className="save" type="submit">Save</Button>
        </span>
      </header>
      <dl>
        <dt>Member since</dt>
        <dd>{memberSince}</dd>
      </dl>
      <Field component={TextAreaField} id="notes" name="notes" label="Notes" />
      <Field component={SelectField} id="groups" name="groups" label="Groups" multiple >
        {groupOptions.map(group => (<option key={group.id} value={group.id}>{group.name}</option>))}
      </Field>
      <fieldset>
        <fieldset className="field-pair">
          <Field component={InputField} id="firstName" name="firstName" label="First name" type="text" />
          <Field component={InputField} id="lastName" name="lastName" label="Last name" type="text" />
        </fieldset>
        <Field component={InputField} id="email" name="email" label="Email" type="email" />
        <Field
          component={InputField}
          id="primaryPhoneNumber"
          name="primaryPhoneNumber"
          label="Contact Number"
          type="tel"
        />
        {addressEnabled &&
          <fieldset>
            <Field component={InputField} id="address" name="postalAddress.address" label="Address" type="text" />
            <Field component={InputField} id="suburb" name="postalAddress.suburb" label="Suburb" type="text" />
            <Field component={InputField} id="postcode" name="postalAddress.postcode" label="Postcode" type="text" />
            <Field component={InputField} id="state" name="postalAddress.state" label="State" type="text" />
            <Field component={InputField} id="country" name="postalAddress.country" label="Country" type="text" />
          </fieldset>}
      </fieldset>
      <Field component={TextAreaField} id="additionalInfo" name="additionalInfo" label="Additional info" />

    </section>
  </form>
);

const mapStateToProps = state => ({
  initialValues: getSelectedMember(state),
  memberSince: moment(getSelectedMember(state).memberSince).format('YYYY/MM/DD'),
  groupOptions: getGroups(state),
});

export default connect(mapStateToProps)(reduxForm({
  form: 'member',
  validate,
  onSubmit: (data, dispatch) => (
    dispatch(update(data))
    .then(() => dispatch(finishEditMember()))
  ),
})(EditMemberForm));
