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
      commands: [
        {
          submit: function() {
            this.click('@submitButton');
            this.api.pause(2000);
          }
        }
      ]
    }
  }
};
