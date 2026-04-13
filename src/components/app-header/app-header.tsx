import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';
import { RootState } from '../../services/store'; // ИСПРАВЛЕНО: импорт RootState

// ИСПРАВЛЕНО: типизация селектора
const selectUserName = (state: RootState) => state.user.user?.name || '';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
