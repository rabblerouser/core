import React from 'react';
import { shallow } from 'enzyme';
import { ProgressSteps } from '../ProgressSteps';
import DetailsForm from '../DetailsForm';
import Finished from '../Finished';

describe('ProgressSteps', () => {
  it('when the currentStep is 0 it renders nothing', () => {
    const rendered = shallow(<ProgressSteps currentStep={0} />);
    expect(rendered.text()).toEqual('');
  });

  it('when the currentStep is 1 it renders the signup form', () => {
    const rendered = shallow(<ProgressSteps currentStep={1} />);
    expect(rendered.find(DetailsForm).length).toEqual(1);
  });

  it('when the currentStep is 2 it renders the finished form', () => {
    const rendered = shallow(<ProgressSteps currentStep={2} />);
    expect(rendered.find(Finished).length).toEqual(1);
  });
});
