import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const labFieldsChecks = {
  name: inputValidator.isValidText,
};

const isValidDetails = lab => (
  _.reduce(labFieldsChecks, (errors, checkFn, labFieldKey) => {
    if (!lab || !checkFn(lab[labFieldKey])) {
      errors.push(labFieldKey);
    }
    return errors;
  }, [])
);

const isValid = lab => _.flatten([isValidDetails(lab)]);

export default { isValid };
