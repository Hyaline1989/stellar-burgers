import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} from '../slices/wsSlice';

interface WSAction {
  type: string;
  payload?: any;
}

export const socketMiddleware = (): Middleware => (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    const { dispatch } = store;
    const wsAction = action as WSAction;
    const { type, payload } = wsAction;

    if (type === wsConnectionStart.type) {
      // payload должен содержать URL (с токеном для ЛК или общий для ленты)
      socket = new WebSocket(payload);
    }

    if (socket) {
      socket.onopen = () => {
        dispatch(wsConnectionSuccess());
      };

      socket.onerror = () => {
        dispatch(wsConnectionError('Ошибка WebSocket'));
      };

      socket.onmessage = (event) => {
        const { data } = event;
        const parsedData = JSON.parse(data);
        if (parsedData.success) {
          dispatch(wsGetMessage(parsedData));
        }
      };

      socket.onclose = () => {
        dispatch(wsConnectionClosed());
      };

      if (
        type === wsConnectionClosed.type &&
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};
