// components/Dashboard/UserDashboard.jsx - MODERN FRAMER MOTION VERSION
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
    FaBookOpen, 
    FaCertificate, 
    FaTrophy, 
    FaChartPie,
    FaPlay,
    FaUser,
    FaDollarSign,
    FaGraduationCap,
    FaArrowUp,
    FaExclamationTriangle
} from 'react-icons/fa';
import { cn } from '../../lib/utils';
import { fetchUserStats } from '../../redux/features/stats/statsSlice';

export const UserDashboard = () => {
    const dispatch = useDispatch();
    const { data: user } = useSelector((state) => state.auth);
    const { userStats, isLoading, error } = useSelector((state) => state.stats);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current && !userStats && !isLoading) {
            hasInitialized.current = true;
            dispatch(fetchUserStats());
        }
    }, [dispatch, userStats, isLoading]);

    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Format currency
    const formatCurrency = (amount) => {
        return `₹${(amount || 0).toLocaleString('en-IN')}`;
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

    const courseCardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }
        }),
        hover: {
            scale: 1.02,
            y: -4,
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
                        Loading your dashboard...
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
                            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Dashboard Unavailable</h2>
                            <p className="text-red-600 dark:text-red-300 mb-6">Error loading dashboard: {error}</p>
                            <motion.button 
                                onClick={() => {
                                    hasInitialized.current = false;
                                    dispatch(fetchUserStats());
                                }}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg"
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
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.5);
                }
            `}</style>
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
                {/* Radial gradient overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            </div>

            <motion.div 
                className="relative p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Banner */}
                    <motion.div 
                        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 shadow-2xl"
                        variants={cardVariants}
                    >
                        {/* Animated background elements */}
                        <motion.div 
                            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.div 
                            className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.05, 0.15, 0.05]
                            }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        />
                        
                        <div className="relative flex items-center space-x-6">
                            <motion.div 
                                className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaUser className="text-3xl text-white" />
                            </motion.div>
                            <div>
                                <motion.h1 
                                    className="text-4xl font-bold text-white mb-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    Welcome back, {userStats?.profile?.name || user?.name || 'Student'}!
                                </motion.h1>
                                <motion.p 
                                    className="text-blue-100 text-lg"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7, duration: 0.6 }}
                                >
                                    Continue your learning journey and achieve your goals
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>

                    {/* KPI Cards */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                        variants={containerVariants}
                    >
                        {[
                            {
                                title: "Courses Enrolled",
                                value: userStats?.overview?.coursesEnrolled || 0,
                                icon: FaBookOpen,
                                color: "blue",
                                bgGradient: "from-blue-400 to-blue-600",
                                change: "+2.5%"
                            },
                            {
                                title: "Courses Completed",
                                value: userStats?.overview?.coursesCompleted || 0,
                                icon: FaTrophy,
                                color: "green",
                                bgGradient: "from-green-400 to-green-600",
                                change: "Coming Soon",
                                isComingSoon: true
                            },
                            {
                                title: "Certificates Earned",
                                value: userStats?.overview?.certificatesEarned || 0,
                                icon: FaCertificate,
                                color: "yellow",
                                bgGradient: "from-yellow-400 to-yellow-600",
                                change: "Coming Soon",
                                isComingSoon: true
                            },
                            {
                                title: "Total Spent",
                                value: formatCurrency(userStats?.overview?.totalSpent),
                                icon: FaDollarSign,
                                color: "purple",
                                bgGradient: "from-purple-400 to-purple-600",
                                change: "+5.2%"
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden group"
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
                                            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        >
                                            {stat.value}
                                        </motion.p>
                                        <div className={`flex items-center text-sm ${stat.isComingSoon ? 'text-gray-500' : `text-${stat.color}-600`}`}>
                                            {!stat.isComingSoon && <FaArrowUp className="mr-1 text-xs" />}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <motion.div 
                                        className={`bg-gradient-to-br ${stat.bgGradient} p-4 rounded-xl shadow-lg`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <stat.icon className="text-2xl text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* My Courses Section */}
                        <motion.div 
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-700/50"
                            variants={cardVariants}
                        >
                            <motion.h2 
                                className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-2 rounded-lg mr-3">
                                    <FaBookOpen className="text-white" />
                                </div>
                                My Courses
                            </motion.h2>
                            
                            {userStats?.enrolledCourses?.length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                                    <AnimatePresence>
                                        {userStats.enrolledCourses.map((course, index) => (
                                            <motion.div 
                                                key={course._id} 
                                                className="relative overflow-hidden bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-lg rounded-2xl p-5 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl group transition-all duration-500"
                                                variants={courseCardVariants}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                            >
                                                {/* Animated background gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                
                                                <div className="relative flex items-center space-x-5">
                                                    {/* Course Thumbnail */}
                                                    <div className="relative">
                                                        <motion.div
                                                            className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"
                                                            whileHover={{ scale: 1.1 }}
                                                        />
                                                        <motion.img 
                                                            src={course.thumbnail?.thumbnailUrl || '/placeholder-course.jpg'} 
                                                            alt={course.title}
                                                            className="relative w-20 h-20 object-cover rounded-2xl shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-course.jpg';
                                                            }}
                                                            whileHover={{ scale: 1.05, rotateY: 5 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                        {/* Progress indicator on thumbnail */}
                                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                                            {course.progress || 0}%
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Course Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <motion.h3 
                                                            className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate"
                                                            whileHover={{ x: 2 }}
                                                        >
                                                            {course.title}
                                                        </motion.h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                                                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                                            {course.category}
                                                        </p>
                                                        
                                                        {/* Enhanced Progress Bar */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{course.progress || 0}%</span>
                                                            </div>
                                                            <div className="relative">
                                                                <div className="w-full bg-gray-200/80 dark:bg-gray-600/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                                                                    <motion.div 
                                                                        className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 h-full rounded-full relative overflow-hidden"
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${course.progress || 0}%` }}
                                                                        transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                                                                    >
                                                                        {/* Shimmer effect */}
                                                                        <motion.div
                                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                                            animate={{ x: [-100, 200] }}
                                                                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                                                        />
                                                                    </motion.div>
                                                                </div>
                                                                {/* Progress stages */}
                                                                <div className="absolute top-0 w-full h-full flex items-center">
                                                                    {[25, 50, 75].map((stage) => (
                                                                        <div
                                                                            key={stage}
                                                                            className="absolute w-0.5 h-full bg-white/50"
                                                                            style={{ left: `${stage}%` }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Play Button */}
                                                    <motion.div
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                    >
                                                        <Link 
                                                            to={`/course/${course._id}/player`}
                                                            className="relative group/btn"
                                                        >
                                                            {/* Button glow effect */}
                                                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover/btn:opacity-30 blur transition-opacity duration-300" />
                                                            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-2xl transform group-hover:scale-105">
                                                                <FaPlay className="text-lg" />
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                </div>
                                                
                                                {/* Bottom accent line */}
                                                <motion.div
                                                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-b-2xl"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${course.progress || 0}%` }}
                                                    transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <FaGraduationCap className="text-gray-300 dark:text-gray-600 text-6xl mx-auto mb-4" />
                                    </motion.div>
                                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-4">
                                        No Courses Yet
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 mb-6">
                                        Start your learning journey by enrolling in a course.
                                    </p>
                                    <motion.div
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Link 
                                            to="/courses" 
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg"
                                        >
                                            Browse Courses
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Learning Interests Graph */}
                        <motion.div 
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-700/50"
                            variants={cardVariants}
                        >
                            <motion.h2 
                                className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-2 rounded-lg mr-3">
                                    <FaChartPie className="text-white" />
                                </div>
                                Learning Interests
                            </motion.h2>
                            
                            {userStats?.categoryDistribution?.length > 0 ? (
                                <motion.div 
                                    className="h-80"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={userStats.categoryDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {userStats.categoryDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                                    backdropFilter: 'blur(10px)'
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
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 180, 360] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <FaChartPie className="text-gray-300 dark:text-gray-600 text-6xl mx-auto mb-4" />
                                    </motion.div>
                                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        No Data Yet
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500">
                                        Enroll in courses to see your learning interests!
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;