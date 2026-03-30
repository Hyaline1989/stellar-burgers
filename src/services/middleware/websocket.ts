import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} from '../slices/wsSlice';

export const socketMiddleware = (): Middleware => {
  let socket: WebSocket | null = null;

  return (store) => (next) => (action: any) => {
    const { dispatch } = store;
    const { type, payload } = action;

    if (type === 'ws/wsConnectionStart') {
      if (socket) {
        socket.close();
      }

      socket = new WebSocket(payload);

      socket.onopen = () => {
        dispatch(wsConnectionSuccess());
      };

      socket.onerror = (event) => {
        dispatch(wsConnectionError('WebSocket error'));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(
            wsGetMessage({
              orders: data.orders,
              total: data.total,
              totalToday: data.totalToday
            })
          );
        }
      };

      socket.onclose = () => {
        dispatch(wsConnectionClosed());
        socket = null;
      };
    }

    if (type === 'ws/wsConnectionClosed' && socket) {
      socket.close();
      socket = null;
    }

    return next(action);
  };
};
