import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import UnauthorizedPage from '../pages/UnauthorizedPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/signin" replace />;
  if (roles && !roles.includes(user.type)) return <UnauthorizedPage />;

  return children;
};

export default ProtectedRoute;
