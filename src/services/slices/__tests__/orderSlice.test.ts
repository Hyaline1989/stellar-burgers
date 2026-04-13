import orderReducer, {
  createOrder,
  fetchOrderByNumber,
  clearOrder,
  clearCurrentOrder
} from '../orderSlice';
import { TOrder } from '../../../utils/types';

describe('order slice', () => {
  const mockOrderResponse = {
    order: { number: 12345 },
    name: 'Test Burger'
  };

  const mockOrder: TOrder = {
    _id: 'order-1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['1', '2']
  };

  describe('createOrder async thunk', () => {
    it('should set isLoading to true when pending', () => {
      const initialState = {
        order: null,
        currentOrder: null,
        isLoading: false,
        error: null
      };

      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set order and isLoading to false when fulfilled', () => {
      const initialState = {
        order: null,
        currentOrder: null,
        isLoading: true,
        error: null
      };

      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual({
        number: mockOrderResponse.order.number,
        name: mockOrderResponse.name
      });
    });

    it('should set error and isLoading to false when rejected', () => {
      const initialState = {
        order: null,
        currentOrder: null,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderByNumber async thunk', () => {
    it('should set isLoading to true when pending', () => {
      const initialState = {
        order: null,
        currentOrder: null,
        isLoading: false,
        error: null
      };

      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set currentOrder and isLoading to false when fulfilled', () => {
      const initialState = {
        order: null,
        currentOrder: null,
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
    });
  });

  describe('clearOrder', () => {
    it('should clear order state', () => {
      const initialState = {
        order: { number: 12345, name: 'Test' },
        currentOrder: null,
        isLoading: false,
        error: null
      };

      const action = clearOrder();
      const state = orderReducer(initialState, action);

      expect(state.order).toBeNull();
    });
  });

  describe('clearCurrentOrder', () => {
    it('should clear currentOrder state', () => {
      const initialState = {
        order: null,
        currentOrder: mockOrder,
        isLoading: false,
        error: null
      };

      const action = clearCurrentOrder();
      const state = orderReducer(initialState, action);

      expect(state.currentOrder).toBeNull();
    });
  });
});
