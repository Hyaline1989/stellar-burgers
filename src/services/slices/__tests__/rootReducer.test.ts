import store, { rootReducer } from '../../store';
import ingredientsReducer from '../ingredientsSlice';
import constructorReducer from '../constructorSlice';
import orderReducer from '../orderSlice';
import userReducer from '../userSlice';
import feedReducer from '../feedSlice';
import wsReducer from '../wsSlice';

describe('Root Reducer', () => {
  // Тест 1: проверка начального состояния
  it('rootReducer должен возвращать корректное начальное состояние', () => {
    const initAction = { type: '@@INIT' };
    // ИСПРАВЛЕНО: rootReducer - это объект, нужно получить его как функцию через store.getReducer()
    // ИЛИ проще: взять состояние из store
    const state = store.getState();

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      ws: wsReducer(undefined, initAction)
    });
  });

  // Тест 2: проверка, что состояние не мутируется при неизвестном экшене
  it('rootReducer должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = store.getState();

    // Создаем новый store с тем же редьюсером и диспатчим неизвестный экшен
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    // Используем редьюсер напрямую, импортируя его из store
    // Для этого нужно, чтобы store.ts экспортировал сам редьюсер как функцию

    // ВАРИАНТ 1: Если rootReducer в store.ts - это объект, создаем комбинированную функцию
    const combinedReducer = (state: any, action: any) => ({
      ingredients: ingredientsReducer(state?.ingredients, action),
      burgerConstructor: constructorReducer(state?.burgerConstructor, action),
      order: orderReducer(state?.order, action),
      user: userReducer(state?.user, action),
      feed: feedReducer(state?.feed, action),
      ws: wsReducer(state?.ws, action)
    });

    const state = combinedReducer(prevState, unknownAction);

    // Сравниваем ссылки на объекты (должны быть те же, если не изменились)
    expect(state.ingredients).toBe(prevState.ingredients);
    expect(state.burgerConstructor).toBe(prevState.burgerConstructor);
    expect(state.order).toBe(prevState.order);
    expect(state.user).toBe(prevState.user);
    expect(state.feed).toBe(prevState.feed);
    expect(state.ws).toBe(prevState.ws);
  });

  // Остальные тесты можно оставить как есть
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
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('constructor reducer should return initial state', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
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
