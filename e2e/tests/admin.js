const signsIn = client => {
  const login = client.page.login();
  login.navigate().assert.title('Rabble Rouser - Login');
  login.expect.section('@form').to.be.visible.before(1000);
  const form = login.section.form;
  form.expect.element('@email').to.be.visible.before(1000);
  form.expect.element('@password').to.be.visible.before(1000);
  form.expect.element('@submitButton').to.be.visible.before(1000);
  form.setValue('@email', 'admin@rr.com');
  form.setValue('@password', 'apassword');
  form.submit(form);
  form.expect.element('@submitButton').not.to.be.present.before(1000);
}

module.exports = {
  'Admin tests' :  client => {
    signsIn(client);

    const admin = client.page.admin();
    client.assert.title('Rabble Rouser - Admin');
    admin.expect.section('@header').to.be.present.before(1000);
    admin.expect.section('@branches').to.be.present.before(1000);
    admin.expect.section('@organisers').to.be.present.before(1000);
    admin.expect.section('@groups').to.be.present.before(1000);
    admin.expect.section('@members').to.be.present.before(1000);
    admin.expect.section('@admins').to.be.present.before(1000);

    const header = admin.section.header;
    header.expect.element('@logoutButton').to.be.present.before(1000);
    header.logout(header);
    client.assert.title('Rabble Rouser - Login');
    client.end();
  }
};
