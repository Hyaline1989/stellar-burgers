import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} from '../slices/wsSlice';
import { TOrdersData } from '../../utils/types';

// Убран any, добавлен тип для payload
interface WSAction {
  type: string;
  payload?: string;
}

export const socketMiddleware = (): Middleware => (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    const { dispatch } = store;
    const wsAction = action as WSAction;
    const { type, payload } = wsAction;

    if (type === wsConnectionStart.type && payload) {
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
        // ИСПРАВЛЕНО: проверяем наличие success в parsedData
        if (parsedData && parsedData.success) {
          dispatch(wsGetMessage(parsedData));
        } else if (parsedData && !parsedData.success) {
          console.error('WebSocket error:', parsedData);
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
