import React from 'react';
import { DetailsForm } from '../DetailsForm';
import { AddressFields } from '../AddressFields';
import { shallow } from 'enzyme';

describe('DetailsForm', () => {
  it('provides the handleSubmit prop to the form', () => {
    const handleSubmit = () => {};
    const rendered = shallow(<DetailsForm handleSubmit={handleSubmit} branches={[]} />);
    expect(rendered.find('form').length).toEqual(1);
    expect(rendered.find('form').props().onSubmit).toEqual(handleSubmit);
  });

  it('doesn\'t render the branches if there\'s only one', () => {
    const branches = [{ id: 'B1', name: 'branch1' }];
    const rendered = shallow(<DetailsForm handleSubmit={() => {}} branches={branches} />);
    expect(rendered.find('option').length).toEqual(0);
  });

  it('renders an option for each provided branch', () => {
    const branches = [{ id: 'B1', name: 'branch1' }, { id: 'B2', name: 'branch2' }];
    const rendered = shallow(<DetailsForm handleSubmit={() => {}} branches={branches} />);
    expect(rendered.find('option').length).toEqual(2);
  });

  it('renders an option with the branch details', () => {
    const branches = [{ id: 'B1', name: 'branch1' }, { id: 'B2', name: 'branch2' }];
    const rendered = shallow(<DetailsForm handleSubmit={() => {}} branches={branches} />);
    const firstOption = rendered.find('option').first();
    expect(firstOption.props().value).toEqual('B1');
    expect(firstOption.contains('branch1')).toEqual(true);
  });

  it('renders residential address fields when address is enabled', () => {
    const rendered = shallow(<DetailsForm handleSubmit={() => {}} branches={[]} addressEnabled />);
    expect(rendered.find('AddressFields').length).toEqual(1);
  });
});
