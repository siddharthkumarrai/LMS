// components/Common/LoadingSpinner.jsx
import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <AiOutlineLoading3Quarters className="animate-spin text-6xl text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard</h2>
                <p className="text-gray-500">Please wait while we fetch your data...</p>
            </div>
        </div>
    );
};
