import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import validate from './memberValidator';
import { SelectField, InputField, TextAreaField, FormHeaderWithSave, FieldSet } from '../../common/forms';
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
    <section>
      <FormHeaderWithSave>
        Member details
      </FormHeaderWithSave>
      <p>Member since {memberSince}</p>
      <Field component={TextAreaField} name="notes" label="Notes" />
      <Field component={SelectField} name="groups" label="Groups" multiple >
        {groupOptions.map(group => (<option key={group.id} value={group.id}>{group.name}</option>))}
      </Field>
      <FieldSet>
        <FieldSet>
          <Field component={InputField} name="firstName" label="First name" type="text" />
          <Field component={InputField} name="lastName" label="Last name" type="text" />
        </FieldSet>
        <Field component={InputField} name="email" label="Email" type="email" />
        <Field
          component={InputField}
          name="primaryPhoneNumber"
          label="Contact Number"
          type="tel"
        />
        {addressEnabled &&
          <FieldSet>
            <Field component={InputField} name="postalAddress.address" label="Address" type="text" />
            <Field component={InputField} name="postalAddress.suburb" label="Suburb" type="text" />
            <Field component={InputField} name="postalAddress.postcode" label="Postcode" type="text" />
            <Field component={InputField} name="postalAddress.state" label="State" type="text" />
            <Field component={InputField} name="postalAddress.country" label="Country" type="text" />
          </FieldSet>}
      </FieldSet>
      <Field component={TextAreaField} name="additionalInfo" label="Additional info" />

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
