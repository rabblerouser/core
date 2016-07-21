import { navigateTo,
  inputById,
  selectOptionById,
  buttonPressByText,
  innerTextByClass,
} from './common';

export const startAtRegister = () => navigateTo('/');
export const enterContactNumber = text => inputById('contactNumber', text);
export const enterMemberName = text => inputById('memberName', text);
export const enterMemberLastName = text => inputById('memberLastName', text);
export const enterContactEmail = text => inputById('contactEmail', text);
export const enterAdditionalInfo = text => inputById('additionalInfo', text);
export const selectBranch = selection => selectOptionById('branchSelection', selection);
export const clickRegister = () => buttonPressByText('Register');
export const visibleProgressMessage = () => innerTextByClass('form-title');
export const visibleValidationErrors = () => innerTextByClass('validationErrors');
