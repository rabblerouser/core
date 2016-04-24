import { navigateTo,
  inputById,
  selectOptionById,
  buttonPressByText,
  buttonPressById,
  textAtClass,
} from './pageHelpers';

export const startAtRegister = () => navigateTo('/');
export const enterContactName = text => inputById('contactName', text);
export const enterContactLastName = text => inputById('contactLastName', text);
export const enterContactNumber = text => inputById('contactNumber', text);
export const enterParticipantName = text => inputById('participantName', text);
export const enterParticipantLastName = text => inputById('participantLastName', text);
export const enterContactEmail = text => inputById('contactEmail', text);
export const enterParticipantBirthYear = text => inputById('participantBirthYear', text);
export const enterAdditionalInfo = text => inputById('additionalInfo', text);
export const selectLab = selection => selectOptionById('labSelection', selection);
export const enterOtherSchoolType = text => {
  buttonPressById('schoolTypeOther');
  inputById('schoolTypeOtherText', text);
};
export const clickRegister = () => buttonPressByText('Register');
export const visibleProgressMessage = () => textAtClass('form-title');
export const visibleValidationErrors = () => textAtClass('validationErrors');
