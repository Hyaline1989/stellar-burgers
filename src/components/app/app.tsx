import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser } from '../../services/slices/userSlice';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  ProfileLayout,
  NotFound404
} from '../../pages';
import {
  AppHeader,
  Modal,
  IngredientDetails,
  OrderInfo
} from '../../components';
import { ProtectedRoute } from '../protected-route';
import { Preloader } from '../../components/ui';
import styles from './app.module.css';
import '../../index.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const { ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    if (localStorage.getItem('refreshToken')) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        {isLoading ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : ingredients.length > 0 ? (
          <>
            <Routes location={background || location}>
              <Route path='/' element={<ConstructorPage />} />
              <Route path='/feed' element={<Feed />} />
              <Route
                path='/ingredients/:id'
                element={
                  <div className={styles.detailPage}>
                    <p className='text text_type_main-large'>
                      Детали ингредиента
                    </p>
                    <IngredientDetails />
                  </div>
                }
              />
              <Route path='/feed/:number' element={<OrderInfo />} />

              <Route
                path='/login'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/forgot-password'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ForgotPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/reset-password'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              
              {/* Вложенные маршруты для профиля */}
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfileLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Profile />} />
                <Route path='orders' element={<ProfileOrders />} />
                <Route path='orders/:number' element={<OrderInfo />} />
              </Route>
              
              <Route path='*' element={<NotFound404 />} />
            </Routes>

            {background && (
              <Routes>
                <Route
                  path='/ingredients/:id'
                  element={
                    <Modal
                      title='Детали ингредиента'
                      onClose={handleModalClose}
                    >
                      <IngredientDetails />
                    </Modal>
                  }
                />
                <Route
                  path='/feed/:number'
                  element={
                    <Modal title='Детали заказа' onClose={handleModalClose}>
                      <OrderInfo />
                    </Modal>
                  }
                />
                <Route
                  path='/profile/orders/:number'
                  element={
                    <ProtectedRoute>
                      <Modal title='Детали заказа' onClose={handleModalClose}>
                        <OrderInfo />
                      </Modal>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            )}
          </>
        ) : (
          <div className={`${styles.title} text text_type_main-medium pt-4`}>
            Нет ингредиентов
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
