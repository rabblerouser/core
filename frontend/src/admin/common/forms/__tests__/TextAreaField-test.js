import React from 'react';
import { shallow } from 'enzyme';
import TextAreaField from '../TextAreaField';
import TextArea from '../TextArea';
import Label from '../Label';


describe('TextAreaField', () => {
  let rendered;

  describe('when there is no error and the field has not been touched', () => {
    beforeEach(() => {
      rendered = shallow(
        <TextAreaField
          input={{ name: 'email-field', value: 'some value' }}
          label="Enter your email"
          meta={{ touched: false, error: '' }}
          placeholder="Email"
        />);
    });

    it('should render a TextArea field with the input props and id', () => {
      const expected = (<TextArea
        name="email-field"
        value="some value"
        placeholder="Email"
      />);
      expect(rendered.containsMatchingElement(expected)).toEqual(true);
    });

    it('should render a Label for the TextArea field', () => {
      const label = rendered.find(Label);
      expect(label.length).toEqual(1);
      expect(label.contains('Enter your email')).toEqual(true);
    });

    it('should not render an error', () => {
      expect(rendered.find('FieldError').length).toEqual(0);
    });
  });

  describe('when there is an error and the field has been touched', () => {
    beforeEach(() => {
      rendered = shallow(
        <TextAreaField
          input={{ name: 'email-field', value: 'some value' }}
          label="Enter your email"
          type="email"
          meta={{ touched: true, error: 'Required field' }}
        />);
    });

    it('should render the TextArea', () => {
      expect(rendered.find(TextArea).length).toEqual(1);
    });

    it('should render an error', () => {
      expect(rendered.find('FieldError').length).toEqual(1);
      expect(rendered.find('FieldError').props().error).toEqual('Required field');
    });
  });
});
