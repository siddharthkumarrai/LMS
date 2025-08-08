import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const AuthRoute = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);

    // Agar user logged-in hai, to usse homepage par bhej do
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Agar user logged-in nahi hai, to usse page (Login/Signup) access karne do
    return <Outlet />;
};

export default AuthRoute;