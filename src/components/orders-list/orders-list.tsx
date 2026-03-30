import { FC, memo, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { fetchUserOrders } from '../../services/slices/feedSlice';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
