import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  wsConnectionClosed
} from '../../services/slices/wsSlice';
import { getCookie } from '../../utils/cookie';
import { OrdersList } from '../../components'; // ИСПРАВЛЕНО: OrdersOrder -> OrdersList
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

  // ИСПРАВЛЕНО: используем OrdersList вместо OrdersOrder
  return <OrdersList orders={orders} />;
};
