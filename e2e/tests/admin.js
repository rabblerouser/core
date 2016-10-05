const signsIn = client => {
  const login = client.page.login();
  login.navigate().assert.title('Rabble Rouser - Login');
  client.pause(2000);
  login.expect.section('@form').to.be.visible;
  const form = login.section.form;
  form.expect.element('@email').to.be.visible;
  form.expect.element('@password').to.be.visible;
  form.expect.element('@submitButton').to.be.visible;
  form.setValue('@email', 'admin@rr.com');
  form.setValue('@password', 'apassword');
  form.submit(form);
  form.expect.element('@submitButton').not.to.be.present;
}

module.exports = {
  'Admin tests' :  client => {
    signsIn(client);
    const admin = client.page.admin();
    client.assert.title('Rabble Rouser - Admin');
    admin.expect.section('@header').to.be.present;
    admin.expect.section('@branches').to.be.present;
    admin.expect.section('@organisers').to.be.present;
    admin.expect.section('@groups').to.be.present;
    admin.expect.section('@members').to.be.present;
    admin.expect.section('@admins').to.be.present;

    const header = admin.section.header;
    header.expect.element('@logoutButton').to.be.present;
    header.logout();
    client.assert.title('Rabble Rouser - Login');
    client.end();
  }
};
