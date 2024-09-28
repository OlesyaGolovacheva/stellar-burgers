import React from 'react';
import { Preloader } from '../../components/ui/preloader/preloader';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  AuthCheckedSelector,
  UserSelector
} from '../../slice/profileUserSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isAuth?: boolean;
};

export const ProtectedRoute = ({ isAuth, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isDataLoading = useSelector(AuthCheckedSelector);
  const user = useSelector(UserSelector);
  const renderContent = () => {
    console.log('auth', isAuth);
    console.log('user', user);
    if (!isDataLoading) {
      return <Preloader />;
    }

    if (!isAuth && !user) {
      return <Navigate replace to='/login' state={{ from: location }} />;
    }

    if (isAuth && user) {
      const from = location.state?.from || { pathname: '/' };
      return <Navigate replace to={from} />;
    }
    return children;
  };

  return renderContent();
};

export default ProtectedRoute;
