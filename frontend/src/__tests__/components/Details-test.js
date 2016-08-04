import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Details from '../../components/Details';

describe('Details step', () => {
  let detailsForm;
  const defaultFormValues = {
    branchSelection: '',
    contactEmail: '',
    contactNumber: '',
    memberName: '',
    memberLastName: '',
    additionalInfo: '',
  };

  beforeEach(() => {
    detailsForm = TestUtils.renderIntoDocument(
      <Details membershipType="full" formValues={defaultFormValues} errors={[]} postAndContinue={() => {}} />
    );
  });

  it('should show list of invalid fields if the details entered were invalid', () => {
    const expectedErrors = ['Email address', 'Member first name', 'Branch to join'];
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expectedErrors.forEach(error => {
      expect(ReactDOM.findDOMNode(errors[0]).textContent).toContain(error);
    });
  });

  it('should show member name error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    const errorText = ReactDOM.findDOMNode(errors[1]).textContent;
    expect(errorText).toMatch(/Please enter the member's name. No symbols allowed./);
  });

  it('should show branch selection error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    expect(ReactDOM.findDOMNode(errors[2]).textContent).toMatch(/Please select a branch to join./);
  });

  it('should show contact email error message if it was not filled in', () => {
    const continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
    TestUtils.Simulate.click(continueButton);
    const errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, 'errors');
    const errorText = ReactDOM.findDOMNode(errors[3]).textContent;
    expect(errorText).toMatch(/Please enter a valid email address i.e. valid@email.com/);
  });
});
