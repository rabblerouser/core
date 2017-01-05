import React from 'react';
import { shallow } from 'enzyme';
import { ProgressIndicator } from '../ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders a details item and a finished item', () => {
    const rendered = shallow(<ProgressIndicator progress={1} />);
    const details = rendered.find('#progress-details');
    expect(details.length).toEqual(1);
    const finish = rendered.find('#progress-finished');
    expect(finish.length).toEqual(1);
  });

  it('when the progress is 1 it marks finished as unvisited and details as active', () => {
    const rendered = shallow(<ProgressIndicator progress={1} />);
    const details = rendered.find('#progress-details');
    expect(details.first().props().className).toEqual('active');
    const finish = rendered.find('#progress-finished');
    expect(finish.first().props().className).toEqual('unvisited');
  });

  it('when the progress is 2 it marks finished as active and details as visited', () => {
    const rendered = shallow(<ProgressIndicator progress={2} />);
    const details = rendered.find('#progress-details');
    expect(details.first().props().className).toEqual('visited');
    const finish = rendered.find('#progress-finished');
    expect(finish.first().props().className).toEqual('active');
  });
});
