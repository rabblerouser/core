module.exports = {
  url: `${process.env.TARGET_HOST}/`,
  sections: {
    details: {
      selector: '#details',
      elements: {
        firstName: 'input#firstName',
        lastName: 'input#lastName',
        email: 'input#email',
        primaryPhoneNumber: 'input#primaryPhoneNumber',
        additionalInfo: 'textarea#additionalInfo',
        submitButton: 'button[type=submit]',
      },
      commands: [
        {
          submit: function submit() {
            this.click('@submitButton');
            this.api.pause(1000);
          },
        },
      ],
    },
    finished: {
      selector: 'section#finished',
      elements: { heading: 'header' },
    },
  },
};
