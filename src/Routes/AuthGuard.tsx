import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser, selectIsAdmin } from '../ReduxStore/Slices/authSlice'

const AuthGuard = ({ children }: any) => {
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!currentUser) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    // User is logged in but not an admin, redirect to home page or an error page
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;
