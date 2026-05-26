import { Navigate } from 'react-router-dom';

function ProtectedRoute({
  children,
  allowedRole,
}) {
  // GET TOKEN
  const token =
    localStorage.getItem('token');

  // GET ROLE
  const role =
    localStorage.getItem('role');

  // NOT LOGGED IN
  if (!token) {
    return <Navigate to="/" />;
  }

  // ROLE CHECK
  if (
    allowedRole &&
    role !== allowedRole
  ) {
    return <Navigate to="/" />;
  }

  // ACCESS ALLOWED
  return children;
}

export default ProtectedRoute;