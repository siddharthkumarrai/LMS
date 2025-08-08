import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    
    // Agar user login nahi hai, to login page par bhej do
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Agar route ke liye specific roles allowed hain aur user ka role usmein nahi hai
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Aap yahan ek "Access Denied" page par bhej sakte hain
        return <Navigate to="/denied" replace />;
    }

    // Agar sab theek hai, to page ko render hone do
    return <Outlet />;
};

export default ProtectedRoute;