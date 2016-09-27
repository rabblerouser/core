import { navigateTo,
  inputById,
  selectOptionById,
  buttonPressByText,
  innerTextByClass,
} from './common';

export const startAtRegister = () => navigateTo('/');
export const enterContactNumber = text => inputById('primaryPhoneNumber', text);
export const enterMemberName = text => inputById('firstName', text);
export const enterMemberLastName = text => inputById('lastName', text);
export const enterContactEmail = text => inputById('email', text);
export const enterAdditionalInfo = text => inputById('additionalInfo', text);
export const selectBranch = selection => selectOptionById('branchId', selection);
export const clickRegister = () => buttonPressByText('Register');
export const visibleProgressMessage = () => innerTextByClass('form-title');
