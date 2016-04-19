import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const groupFieldsChecks = {
  name: inputValidator.isValidName,
  description: inputValidator.isValidTextBlock,
};

const isValidDetails = group => (
  _.reduce(groupFieldsChecks, (errors, checkFn, groupFieldKey) => {
    if (!group || !checkFn(group[groupFieldKey])) {
      errors.push(groupFieldKey);
    }
    return errors;
  }, [])
);

const isValid = group => _.flatten([isValidDetails(group)]);

module.exports = { isValid };
