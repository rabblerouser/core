export const Resources = {
  privacyPolicy: 'https://pirateparty.org.au/privacy/',
  labHost: 'http://localhost:3000',
  labListEndPoint: 'branches',
  applicationsEndPoint: 'members',
  theLabContactEmail: 'admin@thelab.org.au'
};

export const ApplicationForm = {
  instructions: 'Please fill in the following information and we\'ll let you know when space becomes available at the lab',
  labPlaceholder: 'Select Lab',
  byoReminder: 'Please be aware that participants will need to bring their own laptop to the lab',
  ageReminder: 'Please note that our target age is between 10 and 16 years',
  submitButton: 'Submit',
  remoteSubmitErrorTitle: `Sorry, we could not register you this time. Please try again, or contact us at ${Resources.theLabContactEmail}`,
  validationErrorTitle: 'Please check the following fields:'
};

export const ApplicationFormFieldLabels = {
  contactName: 'First name',
  contactLastName: 'Last name',
  contactEmail: 'Email address',
  contactNumber: 'Contact number',
  childName: 'First name',
  childLastName: 'Last name',
  childBirthYear: 'Child\'s year of birth',
  schoolType: 'What type of school does your child attend?',
  labSelection: 'Lab to join',
  additionalInfo: 'Do you have anything else you think we should know?'
};

export const ApplictionFormValidationErrors = {
  contactName: {name: 'Contact Name', message: 'Please enter a contact name. No symbols allowed'},
  contactLastName: {name: 'Contact Last Name', message: 'No symbols allowed'},
  contactEmail: {name: 'Contact Email', message: 'Please enter a valid email address i.e. valid@email.com'},
  contactNumber: {name: 'Contact Number', message: 'Please enter a valid phone number'},
  childName: {name: 'Child Name', message: 'Please enter the child\'s name. No symbols allowed'},
  childLastName: {name: 'Participant Last Name', message: 'No symbols allowed'},
  childBirthYear: {name: 'Birth Year', message: 'Please select the year of birth'},
  schoolType: {name: 'School Type', message: 'Please select a school'},
  labSelection: {name: 'Lab Selection', message: 'Please select a lab to attend'},
  additionalInfo: {name: 'Additional Info', message: 'No symbols allowed'}
};
