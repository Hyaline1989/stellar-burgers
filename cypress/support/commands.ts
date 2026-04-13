/// <reference types="cypress" />

// Настройка моковых токенов
Cypress.Commands.add('setMockTokens', () => {
  const mockAccessToken = 'mock-access-token-12345';
  const mockRefreshToken = 'mock-refresh-token-67890';
  
  cy.setCookie('accessToken', mockAccessToken);
  localStorage.setItem('refreshToken', mockRefreshToken);
});

Cypress.Commands.add('clearMockTokens', () => {
  cy.clearCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Перехват API запросов
Cypress.Commands.add('interceptIngredients', () => {
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: ingredients,
    }).as('getIngredients');
  });
});

Cypress.Commands.add('interceptCreateOrder', () => {
  cy.fixture('order.json').then((order) => {
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: order,
    }).as('createOrder');
  });
});

Cypress.Commands.add('interceptUser', () => {
  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: user,
    }).as('getUser');
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      setMockTokens(): Chainable<void>;
      clearMockTokens(): Chainable<void>;
      interceptIngredients(): Chainable<void>;
      interceptCreateOrder(): Chainable<void>;
      interceptUser(): Chainable<void>;
    }
  }
}

export {};
