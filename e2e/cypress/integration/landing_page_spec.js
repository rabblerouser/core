describe('Landing page', function () {
  it('should assert that title text is correct', function () {
    cy.visit('http://localhost:3000');
    cy.title().should('include', 'Sign Up');
  });
});
