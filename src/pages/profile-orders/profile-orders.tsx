import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  wsConnectionClosed
} from '../../services/slices/wsSlice';
import { getCookie } from '../../utils/cookie';
import { OrdersOrder } from '../../components'; // Используйте ваш UI компонент списка
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.ws);

  useEffect(() => {
    const accessToken = getCookie('accessToken')?.replace('Bearer ', '');
    if (accessToken) {
      dispatch(
        wsConnectionStart(
          `wss://norma.education-services.ru/orders?token=${accessToken}`
        )
      );
    }

    return () => {
      dispatch(wsConnectionClosed());
    };
  }, [dispatch]);

  if (orders.length === 0) {
    return <Preloader />;
  }

  // Замените на ваш UI компонент для отображения списка заказов профиля
  return <OrdersOrder orders={orders} />;
};
