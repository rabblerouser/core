import React from 'react';
import FormFieldLabel from '../../../components/form/FormFieldLabel.jsx';
import InlineError from '../../../components/form/InlineError.jsx';
import { ApplicationFormFieldLabels as Labels } from '../../../config/strings.js';
import sd from 'skin-deep';

describe('FormFieldLabel', () => {
  let renderedTree = '';

  describe('when there is a field name', () => {
    beforeEach(() => {
      renderedTree = sd.shallowRender(<FormFieldLabel fieldName="contactName" />);
    });

    it('should set a label with a text lookup for the field', () => {
      const element = renderedTree.subTree('label');
      expect(element).not.toBeFalsy();
    });

    it('should have label text from configured strings', () => {
      const element = renderedTree.subTree('label');
      expect(element).not.toBeFalsy();
      expect(element.props.htmlFor).toBe('contactName');
      expect(element.text()).toBe(Labels.contactName);
    });
  });

  describe('when the field is optional', () => {
    beforeEach(() => {
      renderedTree = sd.shallowRender(<FormFieldLabel isOptional />);
    });

    it('should include the text (optional) in a span', () => {
      const element = renderedTree.subTree('span');
      expect(element).not.toBeFalsy();
      expect(element.props.className).toBe('optional');
      expect(element.text()).toContain('(optional)');
    });
  });

  describe('when the field is not optional', () => {
    beforeEach(() => {
      renderedTree = sd.shallowRender(<FormFieldLabel fieldName="contactName" isOptional={false} />);
    });

    it('should not include the text (optional) as a span', () => {
      const element = renderedTree.subTree('span');
      expect(element).not.toBeFalsy();
      expect(element.props.className).toBe('mandatory');
      expect(element.text()).toBe('');
    });
  });

  // Needs to be made less brittle
  describe('when there is an error', () => {
    beforeEach(() => {
      renderedTree = sd.shallowRender(<FormFieldLabel fieldName="contactName" hasError />);
    });

    it('should include an InlineError element', () => {
      expect(renderedTree.props.children[2].type).toBe(InlineError);
    });

    it('should have the invalid class assigned to the label', () => {
      const element = renderedTree.subTree('label');
      expect(element).not.toBeFalsy();
      expect(element.props.className).toBe('invalid');
    });
  });

  // Needs to be made less brittle
  describe('when there is no error', () => {
    beforeEach(() => {
      renderedTree = sd.shallowRender(<FormFieldLabel fieldName="contactName" hasError={false} />);
    });

    it('should not include an InlineError element', () => {
      expect(renderedTree.props.children[2].type).not.toBe(InlineError);
    });

    it('should not have the invalid class assigned to the label', () => {
      const element = renderedTree.subTree('label');
      expect(element).not.toBeFalsy();
      expect(element.props.className).not.toBe('invalid');
    });
  });
});
