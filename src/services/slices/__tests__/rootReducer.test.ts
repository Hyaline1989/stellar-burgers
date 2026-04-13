import ingredientsReducer from '../ingredientsSlice';
import constructorReducer from '../constructorSlice';
import orderReducer from '../orderSlice';
import userReducer from '../userSlice';
import feedReducer from '../feedSlice';
import wsReducer from '../wsSlice';

describe('Root Reducer', () => {
  it('should have all reducers defined', () => {
    expect(ingredientsReducer).toBeDefined();
    expect(constructorReducer).toBeDefined();
    expect(orderReducer).toBeDefined();
    expect(userReducer).toBeDefined();
    expect(feedReducer).toBeDefined();
    expect(wsReducer).toBeDefined();
  });

  it('ingredients reducer should return initial state', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      error: null
    };
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('constructor reducer should return initial state', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('order reducer should return initial state', () => {
    const initialState = {
      order: null,
      currentOrder: null,
      isLoading: false,
      error: null
    };
    expect(orderReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('user reducer should return initial state', () => {
    const initialState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    };
    expect(userReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('feed reducer should return initial state', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    };
    expect(feedReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('ws reducer should return initial state', () => {
    const initialState = {
      wsConnected: false,
      orders: [],
      total: 0,
      totalToday: 0
    };
    expect(wsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });
});
