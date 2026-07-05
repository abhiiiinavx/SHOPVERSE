import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>Please login to access this page</p>
        </div>
      </div>
    );
  }

  if (requiredRole && auth.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
          <p>You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
