module.exports = {
  url: 'http://localhost:3000/dashboard/admin',
  sections: {
    header: {
      selector: 'header.admin-header',
      elements: { logoutButton: 'button.logout' },
      commands: [
        {
          logout: function() {
            this.click('@logoutButton');
            this.api.pause(2000);
          }
        }
      ]
    },
    branches: {
      selector: 'section#branchDetails'
    },
    organisers: {
      selector: 'section#organisers'
    },
    groups: {
      selector: 'section#group-details'
    },
    members: {
      selector: 'section#member-list'
    },
    admins: {
      selector: 'section#admins'
    }
  }
};
