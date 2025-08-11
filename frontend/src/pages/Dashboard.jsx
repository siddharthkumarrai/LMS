// pages/Dashboard.jsx - BEST PRACTICE VERSION
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserDashboard } from '../components/Dashboard/UserDashboard';
import { AdminDashboard } from '../components/Dashboard/AdminDashboard';
import { fetchAdminStats, fetchUserStats } from '../redux/features/stats/statsSlice';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data: user, isLoggedIn } = useSelector((state) => state.auth);
    const { isLoading, error } = useSelector((state) => state.stats);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (isLoggedIn && user?.role && !hasInitialized) {
            console.log(`🚀 Fetching ${user.role} dashboard data`);
            
            if (user.role === 'admin') {
                dispatch(fetchAdminStats());
            } else {
                dispatch(fetchUserStats());
            }
            
            setHasInitialized(true);
        }
    }, [dispatch, isLoggedIn, user?.role, hasInitialized]);

    // Loading state
    if (isLoading || (isLoggedIn && !hasInitialized)) {
        return <LoadingSpinner />;
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Dashboard Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => {
                            setHasInitialized(false);
                            if (user?.role === 'admin') {
                                dispatch(fetchAdminStats());
                            } else {
                                dispatch(fetchUserStats());
                            }
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Render appropriate dashboard
    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
};

export default Dashboard;
