import React from 'react';
import { shallow } from 'enzyme';
import { BranchDetails } from '../BranchDetails';

describe('BranchDetails', () => {
  let rendered;
  const branch = {
    name: 'Branch name',
    contact: 'Contact details',
    notes: 'This branch is decent',
  };

  beforeEach(() => {
    rendered = shallow(<BranchDetails selectedBranch={branch} />);
  });

  it('renders the header with the branch name', () => {
    const heading = rendered.find('h3');
    expect(heading.text()).toContain('Branch name');
  });

  it('renders details with any contact and notes', () => {
    expect(rendered.text()).toContain('Contact details');
    expect(rendered.text()).toContain('This branch is decent');
  });
});
