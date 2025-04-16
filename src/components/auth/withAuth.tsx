
import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface WithAuthOptions {
  redirectTo: string;
  allowedRoles?: string[];
  loadWhileRedirecting?: boolean;
}

function withAuth<P extends object>(options: WithAuthOptions) {
  return function withAuthComponent(WrappedComponent: ComponentType<P>) {
    return function WithAuth(props: P) {
      const { user, isAuthenticated, isLoading } = useAuth();
      
      // Show nothing while checking authentication
      if (isLoading) {
        return options.loadWhileRedirecting ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : null;
      }
      
      // Redirect if not authenticated
      if (!isAuthenticated) {
        return <Navigate to={options.redirectTo} replace />;
      }
      
      // Check role requirements if specified
      if (options.allowedRoles && options.allowedRoles.length > 0) {
        const userRole = user?.role;
        if (!userRole || !options.allowedRoles.includes(userRole)) {
          return <Navigate to={options.redirectTo} replace />;
        }
      }
      
      // Render the protected component
      return <WrappedComponent {...props} />;
    };
  };
}

export default withAuth;
