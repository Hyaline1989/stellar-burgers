import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  wsConnectionStart,
  wsConnectionClosed
} from '../../services/slices/wsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.ws);

  useEffect(() => {
    dispatch(wsConnectionStart('wss://norma.education-services.ru/orders/all'));
    return () => {
      dispatch(wsConnectionClosed());
    };
  }, [dispatch]);

  // Если заказы уже есть в сторе, показываем интерфейс, иначе — лоадер
  if (orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(wsConnectionClosed());
        dispatch(
          wsConnectionStart('wss://norma.education-services.ru/orders/all')
        );
      }}
    />
  );
};
