describe('Landing page', function () {
  it('should assert that title text is correct', function () {
    // core is the hostname for the process set in docker-compose.test.yml:core
    cy.visit('http://core:3000');
    cy.title().should('include', 'Sign Up');
  });
});
