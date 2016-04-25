import React from 'react';
import InlineError from '../../../components/form/InlineError.jsx';
import sd from 'skin-deep';

describe('InlineError', () => {
  let renderedTree = '';

  describe('render', () => {
    beforeEach(() => {
      renderedTree = sd.shallowRender(<InlineError errorFor="contactName" />);
    });

    it('has a single span with a class of errors', () => {
      const element = renderedTree.subTree('span');
      expect(element).not.toBeFalsy();
      expect(element.text()).toBe('Please enter a contact name. No symbols allowed.');
    });
  });
});
