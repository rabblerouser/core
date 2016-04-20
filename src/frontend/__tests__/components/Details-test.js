import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Details from '../../components/Details.jsx';

describe('Details step', () => {
  let detailsForm;
  const defaultFormValues = {
    labSelection: '',
    contactName: '',
    contactEmail: '',
    contactNumber: '',
    participantName: '',
    participantBirthYear: '',
    schoolType: '',
    contactLastName: '',
    participantLastName: '',
    additionalInfo: '',
  };

  beforeEach(() => {
    detailsForm = TestUtils.renderIntoDocument(<Details membershipType="full" formValues={defaultFormValues} />);
  });

  it('should show list of invalid fields if the details entered were invalid', () => {
    const expectedErrors = 'Contact first nameEmail addressContact numberParticipant first nameParticipant\'s year ' +
      'of birthLab to joinSchool type';
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[0]).textContent).toMatch(expectedErrors);
  });

  it('should show lab selection error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[1]).textContent).toMatch(/Please select a lab to join./);
  });

  it('should show contact name error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[2]).textContent).toMatch(/Please enter a contact name. No symbols allowed./);
  });

  it('should show contact number error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[3]).textContent).toMatch(/Please enter a valid phone number./);
  });

  it('should show contact email error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    const errorText = ReactDOM.findDOMNode(errors[4]).textContent;
    expect(errorText).toMatch(/Please enter a valid email address i.e. valid@email.com/);
  });

  it('should show participant name error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    const errorText = ReactDOM.findDOMNode(errors[5]).textContent;
    expect(errorText).toMatch(/Please enter the participant's name. No symbols allowed./);
  });

  it('should show participant birth year error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[6]).textContent).toMatch(/Please select the year of birth./);
  });

  it('should show school type error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[7]).textContent).toMatch(/Please select a school type./);
  });
});
