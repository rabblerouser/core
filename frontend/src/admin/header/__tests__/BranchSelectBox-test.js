import React from 'react';
import { shallow } from 'enzyme';
import { BranchSelectBox } from '../BranchSelectBox';
import { Select } from '../../common/forms';

describe('BranchSelectBox', () => {
  it('should render a select with an entry for each branch', () => {
    const branchSelectBox = shallow(<BranchSelectBox branches={[{ id: 1 }, { id: 2 }]} />);
    expect(branchSelectBox.find('option').length).toEqual(2);
  });

  it('should have the selected branch selected', () => {
    const branchSelectBox = shallow(<BranchSelectBox selected="1" branches={[{ id: 1 }, { id: 2 }]} />);
    const select = branchSelectBox.find(Select);
    expect(select.props().value).toEqual('1');
  });

  it('should fire a branchSelected action when a branch is selected', () => {
    const selectedSpy = jasmine.createSpy();
    const branchSelectBox = shallow(<BranchSelectBox onSelect={selectedSpy} branches={[{ id: 1 }, { id: 2 }]} />);
    branchSelectBox.find(Select).simulate('change', { target: '2' });
    expect(selectedSpy).toHaveBeenCalled();
  });
});
