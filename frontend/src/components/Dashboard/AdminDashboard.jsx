// components/Dashboard/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    FaDollarSign,
    FaUsers,
    FaBook,
    FaUserGraduate,
    FaPlus,
    FaCog,
    FaChartLine,
    FaChartBar,
    FaChartPie,
    FaClock,
    FaExclamationTriangle,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaEdit
} from 'react-icons/fa';
import { cn } from '../../lib/utils';
import { fetchAdminStats } from '../../redux/features/stats/statsSlice';

export const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { adminStats, isLoading, error } = useSelector((state) => state.stats);

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Format currency
    const formatCurrency = (amount) => {
        return `₹${(amount || 0).toLocaleString('en-IN')}`;
    };

    // Enhanced date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'N/A';
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.9 
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const statsCardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: (index) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.95 }
    };

    const loadingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5 }
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <motion.div 
                className="min-h-screen relative overflow-hidden"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Animated Grid Background */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
                    <div
                        className={cn(
                            "absolute inset-0",
                            "[background-size:40px_40px]",
                            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                            "dark:[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
                            "opacity-20"
                        )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-50/10 to-purple-50/10 dark:from-transparent dark:via-blue-900/5 dark:to-purple-900/5" />
                </div>

                <div className="flex flex-col items-center justify-center min-h-screen">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
                    />
                    <motion.p 
                        className="text-xl text-gray-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading admin dashboard...
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    // Error state
    if (error) {
        return (
            <motion.div 
                className="min-h-screen relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Background */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950" />
                    <div
                        className={cn(
                            "absolute inset-0",
                            "[background-size:40px_40px]",
                            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                            "dark:[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
                            "opacity-20"
                        )}
                    />
                </div>

                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center backdrop-blur-sm"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Dashboard Data Unavailable</h2>
                            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
                            <motion.button 
                                onClick={() => dispatch(fetchAdminStats())}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Retry Loading Data
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Check if adminStats exists and has overview
    if (!adminStats || !adminStats.overview) {
        return (
            <motion.div 
                className="min-h-screen relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950" />
                    <div
                        className={cn(
                            "absolute inset-0",
                            "[background-size:40px_40px]",
                            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                            "dark:[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
                            "opacity-20"
                        )}
                    />
                </div>

                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            className="bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center backdrop-blur-sm"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">No Data Available</h2>
                            <p className="text-yellow-700 dark:text-yellow-300 mb-6">Dashboard data is not available. Please try refreshing the page.</p>
                            <motion.button 
                                onClick={() => dispatch(fetchAdminStats())}
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-medium shadow-lg"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Retry Loading
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen relative">
            {/* Modern Grid Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
                <div
                    className={cn(
                        "absolute inset-0",
                        "[background-size:40px_40px]",
                        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                        "dark:[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
                        "opacity-20"
                    )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-50/10 to-purple-50/10 dark:from-transparent dark:via-blue-900/5 dark:to-purple-900/5" />
            </div>

            <motion.div 
                className="relative p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div 
                        className="mb-8"
                        variants={cardVariants}
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Real-time platform analytics and performance metrics</p>
                    </motion.div>

                    {/* KPI Cards */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                        variants={containerVariants}
                    >
                        {[
                            {
                                title: "Total Revenue",
                                value: formatCurrency(adminStats.overview?.totalRevenue),
                                icon: FaDollarSign,
                                color: "green",
                                bgGradient: "from-green-400 to-green-600",
                                change: "+12.5%"
                            },
                            {
                                title: "Total Users",
                                value: adminStats.overview?.totalUsers || 0,
                                icon: FaUsers,
                                color: "blue",
                                bgGradient: "from-blue-400 to-blue-600",
                                change: "+8.2%"
                            },
                            {
                                title: "Total Courses",
                                value: adminStats.overview?.totalCourses || 0,
                                icon: FaBook,
                                color: "purple",
                                bgGradient: "from-purple-400 to-purple-600",
                                change: "+3.1%"
                            },
                            {
                                title: "Total Enrollments",
                                value: adminStats.overview?.totalEnrollments || 0,
                                icon: FaUserGraduate,
                                color: "orange",
                                bgGradient: "from-orange-400 to-orange-600",
                                change: "+15.7%"
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden group"
                                variants={statsCardVariants}
                                custom={index}
                                whileHover="hover"
                            >
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                
                                <div className="relative flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                                        <motion.p 
                                            className={`text-3xl font-bold text-${stat.color}-600 mb-2`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        >
                                            {stat.value}
                                        </motion.p>
                                        <div className={`flex items-center text-sm text-${stat.color}-600`}>
                                            <FaArrowUp className="mr-1 text-xs" />
                                            {stat.change}
                                        </div>
                                    </div>
                                    <motion.div 
                                        className={`bg-gradient-to-br ${stat.bgGradient} p-4 rounded-full shadow-lg`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <stat.icon className="text-2xl text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div 
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
                        variants={cardVariants}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    to="/course/create"
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg"
                                >
                                    <FaPlus />
                                    <span>Create New Course</span>
                                </Link>
                            </motion.div>
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    to="/students"
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg"
                                >
                                    <FaCog />
                                    <span>Manage Students</span>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Sales Over Time Chart */}
                    <motion.div 
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
                        variants={cardVariants}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-2 rounded-lg mr-3">
                                <FaChartLine className="text-white" />
                            </div>
                            Sales Over Time
                        </h2>
                        {adminStats.monthlySales && adminStats.monthlySales.length > 0 ? (
                            <motion.div 
                                className="h-80"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={adminStats.monthlySales}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis 
                                            dataKey="month" 
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            stroke="#666"
                                        />
                                        <YAxis yAxisId="left" orientation="left" stroke="#666" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#666" />
                                        <Tooltip 
                                            formatter={(value, name) => [
                                                name === 'revenue' ? formatCurrency(value) : value,
                                                name === 'revenue' ? 'Revenue' : 'Enrollments'
                                            ]}
                                            labelFormatter={(label) => `Month: ${label}`}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Line 
                                            yAxisId="left"
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#8884d8" 
                                            strokeWidth={3}
                                            name="Revenue (₹)"
                                            connectNulls={false}
                                            dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                                        />
                                        <Line 
                                            yAxisId="right"
                                            type="monotone" 
                                            dataKey="enrollments" 
                                            stroke="#82ca9d" 
                                            strokeWidth={3}
                                            name="Enrollments"
                                            connectNulls={false}
                                            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="text-center py-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <FaChartLine className="text-gray-300 text-6xl mx-auto mb-4" />
                                </motion.div>
                                <h3 className="text-lg font-medium text-gray-500 mb-2">No Sales Data</h3>
                                <p className="text-gray-400">Sales data will appear once students make course purchases.</p>
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Course Popularity Chart */}
                        <motion.div 
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                            variants={cardVariants}
                        >
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 p-2 rounded-lg mr-3">
                                    <FaChartBar className="text-white" />
                                </div>
                                Course Popularity
                            </h2>
                            {adminStats.coursePopularity && adminStats.coursePopularity.length > 0 ? (
                                <motion.div 
                                    className="h-80"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={adminStats.coursePopularity} layout="horizontal">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis type="number" stroke="#666" />
                                            <YAxis 
                                                dataKey="courseName" 
                                                type="category" 
                                                width={120}
                                                tick={{ fontSize: 12 }}
                                                stroke="#666"
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Bar dataKey="enrollments" fill="url(#colorGradient)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <FaChartBar className="text-gray-300 text-4xl mx-auto mb-4" />
                                    <p className="text-gray-400">No enrollment data available yet.</p>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Category Distribution */}
                        <motion.div 
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                            variants={cardVariants}
                        >
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-2 rounded-lg mr-3">
                                    <FaChartPie className="text-white" />
                                </div>
                                Category Distribution
                            </h2>
                            {adminStats.categoryDistribution && adminStats.categoryDistribution.length > 0 ? (
                                <motion.div 
                                    className="h-80"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7, duration: 0.6 }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={adminStats.categoryDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {adminStats.categoryDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <FaChartPie className="text-gray-300 text-4xl mx-auto mb-4" />
                                    <p className="text-gray-400">No category data available yet.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div 
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                        variants={cardVariants}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-2 rounded-lg mr-3">
                                <FaClock className="text-white" />
                            </div>
                            Recent Enrollments
                        </h2>
                        {adminStats.recentActivity && adminStats.recentActivity.length > 0 ? (
                            <motion.div 
                                className="overflow-x-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50/80 dark:bg-gray-700/50">
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-l-lg">
                                                Student Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Course Title
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-r-lg">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <AnimatePresence>
                                            {adminStats.recentActivity.map((activity, index) => (
                                                <motion.tr 
                                                    key={index} 
                                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + 0.9 }}
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                                                <FaUsers className="text-white text-sm" />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {activity.studentName || 'Unknown Student'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs">
                                                            {activity.courseTitle || 'Unknown Course'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            {formatCurrency(activity.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(activity.enrollmentDate)}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="text-center py-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <FaClock className="text-gray-300 text-6xl mx-auto mb-4" />
                                </motion.div>
                                <h3 className="text-lg font-medium text-gray-500 mb-2">No Recent Activity</h3>
                                <p className="text-gray-400">Recent enrollments will appear here once students purchase courses.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;