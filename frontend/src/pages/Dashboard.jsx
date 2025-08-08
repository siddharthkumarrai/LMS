import React from 'react';
import { Outlet } from 'react-router';
import LayoutSidebar from '../Layouts/lms-sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <LayoutSidebar />
            <div className="flex-grow p-8">
                {/* Dashboard ke saare pages yahan render honge */}
                <Outlet /> 
            </div>
        </div>
    );
};

export default DashboardLayout;