describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  context('When: Interacting with the "Want to Read" button', () => {
    beforeEach(() => {
      // Search for books
      cy.get('input[type="search"]').type('javascript');
      cy.get('button[aria-label="Search"]').click();

      // Wait for search results to load
      cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
    });

    it('Then: The "Want to Read" button should be disabled after clicking and show snackbar immediately', () => {
      cy.get('[data-testing="book-item"]').first().as('firstBook');
      cy.get('@firstBook').find('[data-testing="add_to_reading_list"]').click();
      cy.get('@firstBook').find('[data-testing="add_to_reading_list"]').should('be.disabled');
      cy.get('.mat-snack-bar-container').should('be.visible');
      cy.get('.mat-snack-bar-container').contains('Added');
      cy.get('.mat-snack-bar-container').contains('Undo').click();
      cy.get('@firstBook').find('[data-testing="add_to_reading_list"]').should('not.be.disabled');
    });
  });

  context('When: Interacting with the reading list', () => {

    beforeEach(() => {
      // Search for books
      cy.get('input[type="search"]').type('javascript');
      cy.get('button[aria-label="Search"]').click();

      // Wait for search results to load
      cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
    });

    it('Then: clicking the remove button should remove the book and show snackbar', () => {

      //get the first book from search result
      cy.get('[data-testing="book-item"]').first().as('firstBook');
      cy.get('@firstBook').find('[data-testing="add_to_reading_list"]').click();

      //Check for the Reading list 
      cy.get('[data-testing="toggle-reading-list"]').click();
      cy.get('[data-testing="reading-list-container"]').should('contain.text', 'My Reading List');
      cy.get('[data-testing="reading-list-item"]').should('have.length', 1);
      cy.get('[data-testing="reading-list-item"]').first().as('readingListFirstBook');


      //select the first book
      cy.get('@readingListFirstBook').find('[data-testing="remove_from_list"]').click();
      cy.get('[data-testing="reading-list-item"]').should('have.length', 0);
      cy.get('@firstBook').find('[data-testing="add_to_reading_list"]').should('not.be.disabled');

      //show snackbar
      cy.get('.mat-snack-bar-container').should('be.visible');
      cy.get('.mat-snack-bar-container').contains('Removed');
      cy.get('.mat-snack-bar-container').contains('Undo').click();
      cy.get('[data-testing="reading-list-item"]').should('have.length', 1);
      cy.get('@firstBook').find('[data-testing="add_to_reading_list"]').should('be.disabled');
    });
  });
});