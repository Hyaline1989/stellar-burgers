import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
// ИСПРАВЛЕНО: убран useNavigate
import { RegisterUI } from '@ui-pages';
import { registerUser } from '../../services/slices/userSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();
  // ИСПРАВЛЕНО: убран navigate

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(
        registerUser({
          name: userName,
          email,
          password
        })
      ).unwrap();
      // ИСПРАВЛЕНО: убрано navigate('/', { replace: true });
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте другой email.');
    }
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
