import { Outlet } from 'react-router';
import LMSSidebar from './lms-sidebar'; // Nayi waali simple sidebar import karo

const DashboardLayout = () => {
    return (
        <div className="flex relative h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar Region */}
            <div className="flex-shrink-0">
                <LMSSidebar />
            </div>

            {/* Main Content Region */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header for the main content */}
                {/* Note: Mobile par thodi padding-left di hai taaki content hamburger button ke peeche na chhupe */}
                <header className="pl-20 md:pl-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Anything here..."
                                    className="w-full sm:w-80 pl-4 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create</button>
                            <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium">Export</button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-4 md:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;