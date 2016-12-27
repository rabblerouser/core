import inputValidator from '../../../lib/inputValidator';

const errorStrings = {
  name: 'Please enter a name. No symbols allowed.',
};

export default values => {
  const errors = {};
  if (!values.name || !inputValidator.isValidText(values.name)) {
    errors.name = errorStrings.name;
  }
  return errors;
};
