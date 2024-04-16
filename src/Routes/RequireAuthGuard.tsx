import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../ReduxStore/hooks'

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuthGuard: React.FC<RequireAuthProps> = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = useAppSelector((state) => state.auth.authenticated);
    const isAdmin = useAppSelector((state) => state.auth.currentUser?.isAdmin || false);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (location.pathname.startsWith('/admin') && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RequireAuthGuard;
