import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

interface WsState {
  wsConnected: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error?: string;
}

const initialState: WsState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0
};

const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    wsConnectionStart: (state, action: PayloadAction<string>) => {},
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.error = undefined;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    wsGetMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} = wsSlice.actions;

export default wsSlice.reducer;
