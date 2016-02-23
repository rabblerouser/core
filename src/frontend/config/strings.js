export const Resources = {
  privacyPolicy: "https://pirateparty.org.au/privacy/"
};

export const ApplicationForm = {
  instructions: "Please fill in the following information and we'll let you know when space becomes available at the lab",
  birthYearPlaceholder: "Select Year",
  schoolTypes: ["Primary", "Secondary", "Other"],
  statePlaceholder: "State",
  labPlaceholder: "Select Lab",
  byoReminder: "Please be aware that participants will need to bring their ownlaptop to the lab",
  submitButton: "Submit"
}

export const ApplicationFormFields = [
  'contactName',
  'contactEmail',
  'contactNumber',
  'childName',
  'birthYear',
  'schoolType',
  'labSelection',
  'additionalInfo'
]

export const ApplicationFormFieldLabels = {
  contactName: "Parent / Guardian name",
  contactEmail: "Email address",
  contactNumber: "Contact number",
  childName: "Child's name",
  birthYear: "Child's year of birth",
  schoolType: "What type of school does your child attend?",
  labSelection: "Lab to join",
  additionalInfo: "Do you have anything else you think we should know?"
}

export const ApplictionFormValidationErrors = {
  contactName: {name: 'Contact Name', message: 'Please enter a contact name. No symbols allowed'},
  contactEmail: {name: 'Contact Email', message: 'Please enter a valid email address i.e. valid@email.com'},
  contactNumber: {name: 'Contact Number', message: 'Please enter a valid phone number'},
  childName: {name: 'Child Name', message: 'Please enter the child\'s name. No symbols allowed'},
  birthYear: {name: 'Birth Year', message: 'Please select the year of birth'},
  schoolType: {name: 'School Type', message: 'Please select a school'},
  labSelection: {name: 'Lab Selection', message: 'Please select a lab to attend'}
}
