module.exports = {
  url: `${process.env.TARGET_HOST}/dashboard/admin`,
  sections: {
    header: {
      selector: 'header.admin-header',
      elements: { logoutButton: 'button.logout' },
      commands: [
        {
          logout: function logout() {
            this.click('@logoutButton');
            this.api.pause(1000);
          },
        },
      ],
    },
    branches: {
      selector: 'section#branchDetails',
    },
    organisers: {
      selector: 'section#organisers',
    },
    groups: {
      selector: 'section#group-details',
    },
    members: {
      selector: 'section#member-list',
    },
    admins: {
      selector: 'section#admins',
    },
  },
};
