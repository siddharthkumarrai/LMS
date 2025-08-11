import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMyCreatedCourses, fetchMySubscribedCourses, deleteCourse } from '../redux/features/courses/courseSlice';
import { FaQuestionCircle, FaPlay, FaEdit, FaTrash, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { cn } from '../lib/utils';

// =================================================================
// COMPONENT 1: Modern Animated Course Card
// =================================================================

const CourseCard = ({ course, role, index }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.courses);
    const [isDeleting, setIsDeleting] = useState(false);

    const instructorName = course.createdBy?.name || 'Unknown Instructor';
    const thumbnailUrl = course.thumbnail?.thumbnailUrl || 'https://placehold.co/600x400?text=No+Image';
    const description = course.description || 'No description available.';

    // Delete course handler with confirmation
    const handleDeleteCourse = async (e) => {
        e.stopPropagation();
        
        const isConfirmed = window.confirm(
            `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
        );
        
        if (isConfirmed) {
            setIsDeleting(true);
            try {
                await dispatch(deleteCourse(course._id)).unwrap();
            } catch (error) {
                console.error('Delete failed:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Admin card click handler
    const handleCardClickForAdmin = () => {
        navigate(`/course/${course._id}/player`);
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.9
        },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }),
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            x: -300,
            transition: {
                duration: 0.4
            }
        }
    };

    const imageVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95
        }
    };

    const CardContent = (
        <motion.div
            className="relative overflow-hidden"
            whileHover="hover"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            custom={index}
        >
            {/* Gradient overlay for modern look */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Animated border */}
            <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
                    backgroundSize: '200% 100%',
                }}
                animate={{
                    backgroundPosition: ['200% 0%', '-200% 0%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
            />

            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md flex overflow-hidden group transition-all duration-500 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                {/* Left Side: Image with overlay effects */}
                <div className="w-1/3 flex-shrink-0 relative overflow-hidden">
                    <motion.img 
                        className="w-full h-full object-cover" 
                        src={thumbnailUrl} 
                        alt={course.title}
                        variants={imageVariants}
                    />
                    {/* Gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play icon overlay */}
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3">
                            <FaPlay className="text-blue-600 text-xl" />
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Content with enhanced typography */}
                <div className="w-2/3 p-6 flex flex-col relative">
                    <div className="flex-grow">
                        <motion.h3 
                            className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                            title={course.title}
                            whileHover={{ x: 4 }}
                        >
                            {course.title}
                        </motion.h3>
                        
                        <motion.p 
                            className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed" 
                            title={description}
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                        >
                            {description}
                        </motion.p>
                        
                        <motion.div 
                            className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                            whileHover={{ x: 2 }}
                        >
                            <FaGraduationCap className="mr-2" />
                            {instructorName}
                        </motion.div>
                    </div>

                    <motion.div 
                        className="mt-6 flex-shrink-0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {role === 'USER' ? (
                            <motion.button
                                onClick={() => navigate(`/course/${course._id}/player`)}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-blue-500/25"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <FaPlay className="text-sm" />
                                Start Learning
                            </motion.button>
                        ) : (
                            <div className="flex gap-3 text-sm">
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/course/manage-lectures/${course._id}`);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-amber-500/25"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <FaEdit className="text-sm" />
                                    Manage
                                </motion.button>
                                
                                <motion.button
                                    onClick={handleDeleteCourse}
                                    disabled={loading || isDeleting}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                    variants={buttonVariants}
                                    whileHover={!loading && !isDeleting ? "hover" : {}}
                                    whileTap={!loading && !isDeleting ? "tap" : {}}
                                >
                                    {(loading || isDeleting) ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <FaTrash className="text-sm" />
                                            Delete
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );

    if (role === 'ADMIN') {
        return (
            <motion.div
                onClick={handleCardClickForAdmin}
                className="cursor-pointer"
                layout
            >
                {CardContent}
            </motion.div>
        );
    }

    return <motion.div layout>{CardContent}</motion.div>;
};

// =================================================================
// MAIN PAGE COMPONENT with Modern Grid Background
// =================================================================
const MyCoursesPage = () => {
    const dispatch = useDispatch();
    const { role } = useSelector((state) => state.auth);
    const { myCourses, loading } = useSelector((state) => state.courses);
    const [activeTab, setActiveTab] = useState('all');

    const isAdminOrInstructor = role?.toUpperCase() === 'ADMIN' || role?.toUpperCase() === 'INSTRUCTOR';

    useEffect(() => {
        if (role) {
            if (isAdminOrInstructor) {
                dispatch(fetchMyCreatedCourses());
            } else {
                dispatch(fetchMySubscribedCourses());
            }
        }
    }, [dispatch, role, isAdminOrInstructor]);

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

    const tabVariants = {
        active: {
            scale: 1.05,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgba(59, 130, 246, 0.5)"
        },
        inactive: {
            scale: 1,
            backgroundColor: "transparent",
            borderColor: "transparent"
        }
    };

    const loadingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5 }
        }
    };

    if (loading) {
        return (
            <motion.div 
                className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
                />
                <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading Your Courses...
                </motion.p>
            </motion.div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Modern Grid Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950" />
                <div
                    className={cn(
                        "absolute inset-0",
                        "[background-size:40px_40px]",
                        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                        "dark:[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
                        "opacity-30"
                    )}
                />
                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
            </div>

            <motion.div 
                className="relative p-4 md:p-6 text-gray-800 dark:text-gray-200"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto"
                    layout
                >
                    <div className="flex-grow">
                        {/* Enhanced Tab Navigation */}
                        <motion.div 
                            className="flex space-x-2 mb-8"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {['all'].map((tab) => (
                                <motion.button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 capitalize",
                                        activeTab === tab
                                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/50 shadow-lg'
                                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                                    )}
                                    variants={tabVariants}
                                    animate={activeTab === tab ? "active" : "inactive"}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {tab === 'all' ? 'All Courses' : 'In Progress'}
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Course Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                className="space-y-6"
                                layout
                            >
                                {myCourses?.length > 0 ? (
                                    <AnimatePresence>
                                        {myCourses.map((course, index) => (
                                            <CourseCard
                                                key={course._id}
                                                course={course}
                                                role={isAdminOrInstructor ? 'ADMIN' : 'USER'}
                                                index={index}
                                            />
                                        ))}
                                    </AnimatePresence>
                                ) : (
                                    <motion.div
                                        className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
                                        >
                                            <FaGraduationCap className="text-white text-2xl" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                                            No Courses Found
                                        </h3>
                                        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                                            {isAdminOrInstructor 
                                                ? 'Ready to share your knowledge? Start creating your first course and inspire learners worldwide.' 
                                                : 'Begin your learning journey today! Discover amazing courses tailored just for you.'
                                            }
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Enhanced Sidebar */}
                    <motion.div 
                        className="w-full lg:w-80 lg:flex-shrink-0"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <FaChartLine className="text-blue-500 text-xl" />
                                <h3 className="font-bold text-lg">Skills Report</h3>
                            </div>
                            
                            <motion.div 
                                className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    animate={{ 
                                        rotateY: [0, 180, 360],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        duration: 3, 
                                        repeat: Infinity,
                                        ease: "easeInOut" 
                                    }}
                                    className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-4"
                                >
                                    <FaChartLine className="text-white" />
                                </motion.div>
                                <p className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    COMING SOON
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Advanced analytics and insights to track your learning progress
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Enhanced Support Section */}
                <motion.div 
                    className="mt-12 max-w-7xl mx-auto"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <motion.div 
                        className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl shadow-lg p-6 flex items-center justify-between border border-orange-200 dark:border-orange-800 backdrop-blur-sm"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-4"
                            >
                                <FaQuestionCircle className="text-white text-2xl" />
                            </motion.div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Got questions? We're here to help!</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Our support team is always ready to assist you
                                </p>
                            </div>
                        </div>
                        <motion.button 
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Support
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MyCoursesPage;