describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="reading-list-container"]').should('contain.text', 'My Reading List');
  });

  context('When: Interacting with the "Want to Read" button', () => {
    beforeEach(() => {
      // Search for books
      cy.get('input[type="search"]').type('JavaScript');
      cy.get('button[aria-label="Search"]').click();

      // Wait for search results to load
      cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
    });

    it('Then: The "Want to Read" button should be disabled after clicking', () => {
      cy.get('[data-testing="book-item"]').first().within(() => {
        cy.get('button[aria-label="want_to_read"]').should('not.be.disabled');
        cy.get('button[aria-label="want_to_read"]').click();
        cy.get('button[aria-label="want_to_read"]').should('be.disabled');
      });
    });

    it('Then: The "Want to Read" button should be disabled after clicking and show snackbar', () => {
      cy.get('[data-testing="book-item"]').first().within(() => {
        cy.get('button[aria-label="want_to_read"]').should('not.be.disabled');
        cy.get('button[aria-label="want_to_read"]').click();
        cy.get('button[aria-label="want_to_read"]').should('be.disabled');
      });

      cy.get('.mat-snack-bar-container').should('be.visible');
      cy.get('.mat-snack-bar-container').contains('Added');
      cy.get('.mat-snack-bar-container').contains('Undo').click();
      cy.get('button[aria-label="want_to_read"]').should('not.be.disabled');
    });
  });

  context('When: Interacting with the reading list', () => {
    beforeEach(() => {
      // Search for books
      cy.get('input[type="search"]').type('JavaScript');
      cy.get('button[aria-label="Search"]').click();

      // Wait for search results to load
      cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);

      // Click on the first book's "Want to Read" button to add it to the reading list
      cy.get('[data-testing="book-item"]').first().within(() => {
        cy.get('button').should('not.be.disabled');
        cy.get('button').click();
        cy.get('button').should('be.disabled');
      });
    });

    it('Then: Clicking the remove button should remove the book from the reading list and show snackbar', () => {
      cy.get('[data-testing="toggle-reading-list"]').click();
      cy.get('[data-testing="reading-list-container"]').should('contain.text', 'My Reading List');
      cy.get('[data-testing="book-item"]').should('have.length', 1);

      cy.get('[data-testing="book-item"]').first().within(() => {
        cy.get('button').should('be.visible').click();
      });

      cy.get('.mat-snack-bar-container').should('be.visible');
      cy.get('.mat-snack-bar-container').contains('Removed');
      cy.get('[data-testing="reading-list-container"]').should('not.contain.text', 'My Reading List');
      cy.get('[data-testing="book-item"]').should('not.exist');
      cy.get('[data-testing="book-item"]').first().within(() => {
        cy.get('button[aria-label="want_to_read"]').should('not.be.disabled');
      });
    });
  });
});