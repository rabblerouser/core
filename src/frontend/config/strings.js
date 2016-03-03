export const Resources = {
  privacyPolicy: 'https://pirateparty.org.au/privacy/',
  labHost: 'http://localhost:3000',
  labListEndPoint: 'branches',
  applicationsEndPoint: 'members',
  membersEndPoint: 'members',
  groupListEndPoint: 'groups',
  theLabContactEmail: 'admin@thelab.org.au',
  theLabHome: 'http://thelab.org.au/'
};

export const ApplicationForm = {
  instructions: 'Please fill in the following information and we\'ll let you know when space becomes available at your preferred Lab.',
  labPlaceholder: 'Select Lab',
  byoReminder: 'Please be aware that participants will need to bring their own laptop.',
  ageReminder: 'Please note that our target age is between 10 and 16 years',
  additionalInfoAside: 'Is there anything else you think we should know?',
  submitButton: 'Submit',
  validationErrorTitle: 'Please check the following fields:',
  remoteSubmitErrorTitle: `Sorry, we could not register you this time. Please try again, or contact us at ${Resources.theLabContactEmail}`,
  remoteLabListErrorTitle: `Sorry, we could not get the list of available labs at this time. Please try again, or contact us at ${Resources.theLabContactEmail}`
};

export const ApplicationFormFieldLabels = {
  contactName: 'First name',
  contactLastName: 'Last name',
  contactEmail: 'Email address',
  contactNumber: 'Contact number',
  participantName: 'First name',
  participantLastName: 'Last name',
  participantBirthYear: 'Participant\'s year of birth',
  schoolType: 'What type of school does your participant attend?',
  labSelection: 'Lab to join',
  additionalInfo: 'Additional information'
};

export const ApplictionFormValidationErrors = {
  contactName: {name: 'Contact first name', message: 'Please enter a contact name. No symbols allowed.'},
  contactLastName: {name: 'Contact last name', message: 'No symbols allowed.'},
  contactEmail: {name: 'Email address', message: 'Please enter a valid email address i.e. valid@email.com'},
  contactNumber: {name: 'Contact number', message: 'Please enter a valid phone number.'},
  participantName: {name: 'Participant first name', message: 'Please enter the participant\'s name. No symbols allowed.'},
  participantLastName: {name: 'Participant last name', message: 'No symbols allowed.'},
  participantBirthYear: {name: 'Participant\'s year of birth', message: 'Please select the year of birth.'},
  schoolType: {name: 'School type', message: 'Please select a school type.'},
  labSelection: {name: 'Lab to join', message: 'Please select a lab to join.'},
  additionalInfo: {name: 'Additional info', message: 'No symbols allowed.'}
};
