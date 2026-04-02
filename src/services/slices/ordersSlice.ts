import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';
import { resetConstructor } from './burgerConstructorSlice';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const res = await orderBurgerApi(ingredients);
    const order: TOrder = {
      _id: res.order._id,
      status: res.order.status,
      name: res.order.name,
      createdAt: res.order.createdAt,
      updatedAt: res.order.updatedAt,
      number: res.order.number,
      ingredients: ingredients
    };
    // Очищаем конструктор после успешного создания заказа
    dispatch(resetConstructor());
    return order;
  }
);

type TOrdersState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrdersState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrderModal } = ordersSlice.actions;

export const getOrderRequest = (state: RootState) => state.orders.orderRequest;
export const getOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const getOrderError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;
