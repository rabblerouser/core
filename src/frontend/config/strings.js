export const Resources = {
  privacyPolicy: 'https://pirateparty.org.au/privacy/',
  labHost: 'http://localhost:3000',
  labListEndPoint: 'branches'
};

export const ApplicationForm = {
  instructions: 'Please fill in the following information and we\'ll let you know when space becomes available at the lab',
  labPlaceholder: 'Select Lab',
  byoReminder: 'Please be aware that participants will need to bring their own laptop to the lab',
  ageReminder: 'Please note that our target age is between 10 and 16 years',
  submitButton: 'Submit'
};

export const ApplicationFormFieldLabels = {
  contactName: 'Parent / Guardian name',
  contactEmail: 'Email address',
  contactNumber: 'Contact number',
  childName: 'Child\'s name',
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
  participantLastName: {name: 'Participant Last Name', message: 'No symbols allowed'},
  childBirthYear: {name: 'Birth Year', message: 'Please select the year of birth'},
  schoolType: {name: 'School Type', message: 'Please select a school'},
  labSelection: {name: 'Lab Selection', message: 'Please select a lab to attend'},
  additionalInfo: {name: 'Additional Info', message: 'No symbols allowed'}  
};
