
import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role, RoleDefinition } from '../types';
import { API } from '../services/api';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  isAdminRequired?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, isAdminRequired, children }) => {
  const { user, isLoading } = useAuth();
  const [roles, setRoles] = React.useState<RoleDefinition[]>([]);
  const [rolesLoading, setRolesLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    API.roles.getAll()
      .then(setRoles)
      .catch(console.error)
      .finally(() => setRolesLoading(false));
  }, []);

  const userAccess = useMemo(() => {
    if (!user) return { isAdmin: false };
    const roleDef = roles.find(r => r.id === user.role);
    const isAdmin = user.role === 'it' || (roleDef?.permissions.some(p => p.startsWith('tab.')) ?? false);
    return { isAdmin };
  }, [user, roles]);

  if (isLoading || rolesLoading) return null;

  if (!user) {
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  // If this route specifically requires Admin/Leader access (the /admin path)
  if (isAdminRequired && !userAccess.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Legacy role check
  if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
    return <Navigate to={userAccess.isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
