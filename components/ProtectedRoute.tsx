
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, Role } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  requiredRole?: Role;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, requiredRole, children }) => {
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If they don't have the required role, send them back to their own dashboard or home
    return <Navigate to={user.role === 'member' ? '/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
