import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
// ИСПРАВЛЕНО: убран useNavigate
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();
  // ИСПРАВЛЕНО: убран navigate

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // ИСПРАВЛЕНО: убрано navigate('/', { replace: true });
      // Редирект теперь обрабатывается в ProtectedRoute
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
