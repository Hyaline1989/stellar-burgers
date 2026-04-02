import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(getUser);
  const location = useLocation();

  // Если пользователь не авторизован и роут требует авторизации
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если пользователь авторизован и роут только для неавторизованных
  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} />;
  }

  return children;
};
