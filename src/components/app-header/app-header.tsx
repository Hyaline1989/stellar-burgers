import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
