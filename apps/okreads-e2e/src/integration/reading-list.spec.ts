describe('Reading List Feature', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testing="toggle-reading-list"]').click();
  });

  it('should display the reading list', () => {
    cy.get('[data-testing="reading-list-container"]').should('contain.text', 'My Reading List');
  });

  it('should disable "Want to Read" button when book is added to reading list and enable it when removed', () => {
    cy.get('[data-testing^="add-book-"]').first().as('firstBook');

    cy.get('@firstBook').find('[data-testing^="want-to-read-"]').should('not.be.disabled');
    cy.get('@firstBook').find('[data-testing^="want-to-read-"]').click();
    cy.get('@firstBook').find('[data-testing^="want-to-read-"]').should('be.disabled');

    cy.get('@firstBook').find('[data-testing^="remove-from-reading-list-"]').click();
    cy.get('@firstBook').find('[data-testing^="want-to-read-"]').should('not.be.disabled');
  });

  it('should mark a book as finished and undo it', () => {
    cy.get('[data-testing="finish-book"]').first().as('firstBook');

    cy.get('@firstBook').find('[data-testing="book-status"]').should('not.contain.text', 'Finished');
    cy.get('@firstBook').find('[data-testing="book-status"]').click();
    cy.get('@firstBook').find('[data-testing="book-status"]').should('contain.text', 'Finished');
  });
});