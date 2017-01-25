import React from 'react';
import { shallow } from 'enzyme';
import InputField from '../InputField';
import Input from '../Input';
import Label from '../Label';

describe('InputField', () => {
  let rendered;

  describe('when there is no error and the field has not been touched', () => {
    beforeEach(() => {
      rendered = shallow(
        <InputField
          input={{ name: 'email-field', value: 'some value' }}
          label="Enter your email"
          placeholder="Email"
          type="email"
          id="some-id"
          meta={{ touched: false, error: '' }}
        />);
    });

    it('should render an input field with the input props and id', () => {
      const expected = (<Input
        id="some-id"
        name="email-field"
        value="some value"
        placeholder="Email"
        type="email"
      />);
      expect(rendered.containsMatchingElement(expected)).toEqual(true);
    });

    it('should render a label for the input field', () => {
      const label = rendered.find(Label);
      expect(label.length).toEqual(1);
      expect(label.props().className).not.toEqual('invalid');
      expect(label.contains('Enter your email')).toEqual(true);
    });

    it('should not render an error', () => {
      expect(rendered.find('FieldError').length).toEqual(0);
    });
  });

  describe('when there is an error and the field has been touched', () => {
    beforeEach(() => {
      rendered = shallow(
        <InputField
          input={{ name: 'email-field', value: 'some value' }}
          label="Enter your email"
          type="email"
          id="some-id"
          meta={{ touched: true, error: 'Required field' }}
        />);
    });

    it('should render the input', () => {
      expect(rendered.find(Input).length).toEqual(1);
    });

    it('should render an error', () => {
      expect(rendered.find('FieldError').length).toEqual(1);
      expect(rendered.find('FieldError').props().error).toEqual('Required field');
    });

    it('should apply the invalid class to the label', () => {
      const label = rendered.find(Label);
      expect(label.length).toEqual(1);
      expect(label.props().className).toEqual('invalid');
    });
  });
});
