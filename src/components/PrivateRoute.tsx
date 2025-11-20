import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return signed ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
