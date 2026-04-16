describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    // ИСПРАВЛЕНО: используем относительный путь (можно лучше)
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait(3000);
  });

  describe('Adding Ingredients to Constructor', () => {
    it('should add a bun to constructor', () => {
      // ИСПРАВЛЕНО: проверяем конкретный добавленный ингредиент (критическое)
      cy.get('[data-testid="add-ingredient-button"]').first().click({ force: true });
      cy.get('[data-testid="burger-constructor"]').should('contain', 'Краторная булка N-200i');
    });

    it('should add a main ingredient to constructor', () => {
      // ИСПРАВЛЕНО: проверяем конкретный добавленный ингредиент (критическое)
      cy.get('[data-testid="add-ingredient-button"]').eq(2).click({ force: true });
      cy.wait(1000);
      cy.get('[data-testid="burger-constructor"]').should('contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  describe('Modal Windows', () => {
    it('should open ingredient modal when clicking on ingredient card', () => {
      // ИСПРАВЛЕНО: проверяем, что модалка изначально не видима (можно лучше)
      cy.get('[data-testid="modal"]').should('not.exist');
      
      cy.get('[data-testid="ingredient-card-link"]').first().click({ force: true });
      cy.wait(2000);
      
      // ИСПРАВЛЕНО: проверяем содержимое модалки (критическое)
      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
    });

    it('should close modal by clicking on close button', () => {
      cy.get('[data-testid="modal"]').should('not.exist');
      
      cy.get('[data-testid="ingredient-card-link"]').first().click({ force: true });
      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should close modal by clicking on overlay', () => {
      cy.get('[data-testid="modal"]').should('not.exist');
      
      cy.get('[data-testid="ingredient-card-link"]').first().click({ force: true });
      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should close modal by pressing Escape key', () => {
      cy.get('[data-testid="modal"]').should('not.exist');
      
      cy.get('[data-testid="ingredient-card-link"]').first().click({ force: true });
      cy.get('[data-testid="modal"]').should('exist');
      cy.wait(500);
      cy.get('body').trigger('keydown', { key: 'Escape', code: 'Escape', force: true });
      cy.wait(500);
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Order Creation', () => {
    it('should create order successfully when authenticated', () => {
      // ИСПРАВЛЕНО: устанавливаем моковые токены перед тестом (критическое)
      cy.setMockTokens();
      
      // Перехватываем запрос на создание заказа
      cy.intercept('POST', '**/api/orders', (req) => {
        cy.log('Intercepted POST /api/orders', req.body);
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            name: 'Test Burger',
            order: { number: 54321 }
          }
        });
      }).as('createOrder');
      
      // Добавляем булку
      cy.get('[data-testid="add-ingredient-button"]').first().click({ force: true });
      cy.wait(500);
      
      // Добавляем начинку
      cy.get('[data-testid="add-ingredient-button"]').eq(2).click({ force: true });
      cy.wait(500);
      
      // Проверяем, что конструктор не пустой до заказа
      cy.get('[data-testid="burger-constructor"]').should('contain', 'Краторная булка N-200i');
      
      // Кликаем на кнопку оформления заказа
      cy.contains('Оформить заказ').click();
      
      // Ждем появления модалки с номером заказа
      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal"]').should('contain', '54321');
      
      // Закрываем модалку
      cy.get('[data-testid="modal-close"]').click();
      cy.wait(500);
      
      // ИСПРАВЛЕНО: проверяем очистку конструктора после заказа (критическое)
      cy.get('[data-testid="burger-constructor"]').then(($constructor) => {
        // Проверяем, что булка исчезла (нет текста с названием булки)
        expect($constructor.text()).not.to.contain('Краторная булка N-200i');
        // Проверяем, что ингредиент исчез
        expect($constructor.text()).not.to.contain('Биокотлета из марсианской Магнолии');
      });
      
      // Очищаем токены после теста
      cy.clearMockTokens();
    });
  });
});
