import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

describe('ingredients slice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Ingredient 1',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'image.jpg',
      image_large: 'image-large.jpg',
      image_mobile: 'image-mobile.jpg'
    },
    {
      _id: '2',
      name: 'Ingredient 2',
      type: 'main',
      proteins: 20,
      fat: 20,
      carbohydrates: 20,
      calories: 200,
      price: 200,
      image: 'image2.jpg',
      image_large: 'image-large2.jpg',
      image_mobile: 'image-mobile2.jpg'
    }
  ];

  describe('fetchIngredients async thunk', () => {
    it('should set isLoading to true when pending', () => {
      const initialState = {
        ingredients: [],
        isLoading: false,
        error: null
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set ingredients and isLoading to false when fulfilled', () => {
      const initialState = {
        ingredients: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('should set error and isLoading to false when rejected', () => {
      const initialState = {
        ingredients: [],
        isLoading: true,
        error: null
      };

      const errorMessage = 'Failed to fetch ingredients';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
