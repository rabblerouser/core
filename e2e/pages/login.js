module.exports = {
  url: 'http://localhost:3000/login',
  sections: {
    form: {
      selector: 'form',
      elements: {
        email: 'input#email',
        password: 'input#password',
        submitButton: 'input[type=submit]'
      },
      commands: [{ submit: context => context.click('@submitButton') }]
    }
  }
};
