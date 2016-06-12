import React from 'react';
import FormFieldLabel from '../../../components/form/FormFieldLabel.jsx';
import { ApplicationFormFieldLabels as Labels } from '../../../config/strings.js';
import { shallow } from 'enzyme';

describe('FormFieldLabel', () => {
  describe('when there is a field name', () => {
    it('should have label text from configured strings', () => {
      const element = shallow(<FormFieldLabel fieldName="contactName" />).find('label');
      expect(element).not.toBeFalsy();
      expect(element.text()).toBe(Labels.contactName);
    });
  });

  describe('when the field is optional', () => {
    it('should include the text (optional) in a span', () => {
      const element = shallow(<FormFieldLabel isOptional />).find('span');
      expect(element.text()).toContain('optional');
    });
  });

  describe('when the field is not optional', () => {
    it('should not include the text (optional) as a span', () => {
      const element = shallow(<FormFieldLabel fieldName="contactName" isOptional={false} />).find('span');
      expect(element.prop('className')).toBe('mandatory');
      expect(element.text()).toBe('');
    });
  });

  describe('when there is an error', () => {
    it('should include an InlineError element', () => {
      const element = shallow(<FormFieldLabel fieldName="contactName" hasError />).find('InlineError');
      expect(element).not.toBeFalsy();
    });
  });

  describe('when there is no error', () => {
    it('should not include an InlineError element', () => {
      const element = shallow(<FormFieldLabel fieldName="contactName" />).find('InlineError');
      expect(element.length).toBe(0);
    });
  });
});
