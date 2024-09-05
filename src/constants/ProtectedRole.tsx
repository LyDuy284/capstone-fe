// src/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserContex';

interface ProtectedRouteProps {
    requiredRole: String;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
    const { user } = useUser();

    if (!user || user.roleName !== requiredRole) {
        // Redirect to landing page or login page if not authorized
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
