import inputValidator from '../../common/inputValidator';

const errorStrings = {
  groupName: 'Please enter a group name. No symbols allowed.',
  groupDescription: 'Please enter a description (maximum 2000 characters).',
};

export default values => {
  const errors = {};
  if (!values.name || !inputValidator.isValidText(values.name)) {
    errors.name = errorStrings.groupName;
  }
  if (!values.description || !inputValidator.isValidOptionalTextBlock(values.description)) {
    errors.description = errorStrings.groupDescription;
  }

  return errors;
};
