import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '../../../utils/types';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

describe('burgerConstructor slice', () => {
  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_large: 'https://example.com/bun-large.png',
    image_mobile: 'https://example.com/bun-mobile.png'
  };

  const mockIngredient: TIngredient = {
    _id: 'ing-1',
    name: 'Флюоресцентная булка R2-D3',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://example.com/ing.png',
    image_large: 'https://example.com/ing-large.png',
    image_mobile: 'https://example.com/ing-mobile.png'
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://example.com/sauce.png',
    image_large: 'https://example.com/sauce-large.png',
    image_mobile: 'https://example.com/sauce-mobile.png'
  };

  describe('addIngredient', () => {
    it('should add bun to constructor', () => {
      const initialState = {
        bun: null,
        ingredients: []
      };

      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual({
        ...mockBun,
        id: 'test-uuid-123'
      });
      expect(state.ingredients).toHaveLength(0);
    });

    it('should add ingredient to constructor', () => {
      const initialState = {
        bun: null,
        ingredients: []
      };

      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockIngredient,
        id: 'test-uuid-123'
      });
    });

    it('should replace bun when adding new bun', () => {
      const initialState = {
        bun: {
          ...mockBun,
          id: 'old-id'
        },
        ingredients: []
      };

      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual({
        ...mockBun,
        id: 'test-uuid-123'
      });
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const initialState = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };

      const action = removeIngredient('id-1');
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('id-2');
    });

    it('should not remove anything if id not found', () => {
      const initialState = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: 'id-1' }]
      };

      const action = removeIngredient('non-existent');
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from index 0 to index 1', () => {
      const initialState = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };

      const action = moveIngredient({ from: 0, to: 1 });
      const state = constructorReducer(initialState, action);

      expect(state.ingredients[0].id).toBe('id-2');
      expect(state.ingredients[1].id).toBe('id-1');
    });

    it('should move ingredient from index 1 to index 0', () => {
      const initialState = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };

      const action = moveIngredient({ from: 1, to: 0 });
      const state = constructorReducer(initialState, action);

      expect(state.ingredients[0].id).toBe('id-2');
      expect(state.ingredients[1].id).toBe('id-1');
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      const initialState = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };

      const action = clearConstructor();
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
