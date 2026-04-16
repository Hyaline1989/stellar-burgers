// Константы для селекторов
const MODAL = '[data-testid="modal"]';
const MODAL_CLOSE = '[data-testid="modal-close"]';
const MODAL_OVERLAY = '[data-testid="modal-overlay"]';
const CONSTRUCTOR_BUN_TOP = '[data-testid="constructor-bun-top"]';
const CONSTRUCTOR_INGREDIENTS = '[data-testid="burger-constructor"]';
const ORDER_BUTTON = 'button:contains("Оформить заказ")';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехватываем запрос пользователя
    cy.intercept('GET', '**/api/auth/user', {
      body: {
        success: true,
        user: { email: 'test@test.com', name: 'Test User' }
      }
    }).as('getUser');

    // Перехватываем запрос на обновление токена
    cy.intercept('POST', '**/api/auth/token', {
      body: {
        success: true,
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token'
      }
    }).as('refreshToken');

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', '**/api/orders', {
      body: {
        success: true,
        order: { number: 12345 },
        name: 'Тестовый бургер'
      }
    }).as('createOrder');

    // Используем относительный путь (baseUrl из cypress.config.ts)
    // Устанавливаем токены перед загрузкой страницы
    cy.visit('/', {
      onBeforeLoad(win) {
        win.document.cookie = 'accessToken=test-token';
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });

    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов', () => {
    it('добавляет булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-card"]')
        .find('button')
        .click();
      
      // Проверяем, что появилась именно та булка, по которой кликнули
      cy.get(CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
    });

    it('добавляет начинку в конструктор', () => {
      // Сначала добавляем булку
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-card"]')
        .find('button')
        .click();
      
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('[data-testid="ingredient-card"]')
        .find('button')
        .click();
      
      // Проверяем, что появилась именно та начинка, по которой кликнули
      cy.get(CONSTRUCTOR_INGREDIENTS).should('contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается при клике на ингредиент', () => {
      // Проверяем, что модалка изначально скрыта
      cy.get(MODAL).should('not.exist');
      
      cy.contains('Краторная булка N-200i').click();
      
      // Проверяем, что модалка открылась и содержит данные именно того ингредиента
      cy.get(MODAL).should('exist');
      cy.get(MODAL).should('contain', 'Краторная булка N-200i');
    });

    it('закрывается по клику на крестик', () => {
      cy.get(MODAL).should('not.exist');
      
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('exist');
      
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL).should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.get(MODAL).should('not.exist');
      
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('exist');
      
      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get(MODAL).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('оформляет заказ и очищает конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-card"]')
        .find('button')
        .click();
      
      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('[data-testid="ingredient-card"]')
        .find('button')
        .click();

      // Оформляем заказ
      cy.get(ORDER_BUTTON).click();
      cy.wait('@createOrder');

      // Проверяем модалку с заказом
      cy.get(MODAL).should('exist');
      cy.get(MODAL).should('contain', '12345');

      // Закрываем модалку
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL).should('not.exist');

      // Проверяем, что конструктор очистился (булка исчезла, появился текст "Выберите начинку")
      cy.get(CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
