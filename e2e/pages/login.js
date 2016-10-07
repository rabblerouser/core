module.exports = {
  url: `${process.env.TARGET_HOST}/login`,
  sections: {
    form: {
      selector: 'form',
      elements: {
        email: 'input#email',
        password: 'input#password',
        submitButton: 'input[type=submit]',
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
  },
};
