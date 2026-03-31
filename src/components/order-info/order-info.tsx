import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!number) return;
      setIsLoading(true);
      try {
        const response = await getOrderByNumberApi(Number(number));
        if (response.success && response.orders.length > 0) {
          setOrderData(response.orders[0]);
        } else {
          setError('Заказ не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки заказа');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium'>{error}</div>; // ИСПРАВЛЕНО: одинарные кавычки
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
