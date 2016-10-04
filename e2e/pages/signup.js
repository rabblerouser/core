module.exports = {
  url: 'http://localhost:3000',
  sections: {
    registration: {
      selector: 'form',
      elements: {
        firstName: 'input#firstName',
        lastName: 'input#lastName',
        email: 'input#email',
        primaryPhoneNumber: 'input#primaryPhoneNumber',
        additionalInfo: 'textarea#additionalInfo',
        submitButton: 'button[type=submit]'
      },
      commands: [{ submit: context => context.click('@submitButton') }]
    },
    finished: {
      selector: 'section',
      elements: { heading: '.heading' }
    }
  }
};
