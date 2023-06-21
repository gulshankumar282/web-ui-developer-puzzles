describe('Reading List Feature', () => {
  beforeEach(() => {
    cy.visit('/');
    // cy.get('[data-testing="toggle-reading-list"]').click();
  });

  it('Should: add the books in reading list and mark as finished', () => {
    
    //Search for the books...
    cy.get('input[type="search"]').type('java');
    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
    cy.get('[data-testing="book-item"]').first().as('firstBook');
    cy.get('button[data-testing="add-to-reading-list-button"]').invoke('prop','disabled',false);
    cy.get('@firstBook').find('[data-testing="add-to-reading-list-button"]').click();

    //Check for the Reading list 
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="reading-list-container"]').should('contain.text', 'My Reading List');
    cy.get('[data-testing="reading-list-item"]').should('have.length', 1);

    cy.get('[data-testing="reading-list-item"]').first().as('firstBook');

    //Mark the button as finished
    cy.get('@firstBook').find('[data-testing="mark-as-finished-button"]').click();
    cy.get('@firstBook').find('[data-testing="mark-as-finished-button"]').should('contain.text', 'Finished');

    //close the reading list container
    cy.get('[data-testing="close-drawer"]').click();
  });
});
