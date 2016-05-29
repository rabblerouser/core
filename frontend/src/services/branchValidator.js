import inputValidator from '../lib/inputValidator';
import _ from 'lodash';

const branchFieldsChecks = {
  name: inputValidator.isValidText,
};

const isValidDetails = branch => (
  _.reduce(branchFieldsChecks, (errors, checkFn, branchFieldKey) => {
    if (!branch || !checkFn(branch[branchFieldKey])) {
      errors.push(branchFieldKey);
    }
    return errors;
  }, [])
);

const isValid = branch => _.flatten([isValidDetails(branch)]);

export default { isValid };
