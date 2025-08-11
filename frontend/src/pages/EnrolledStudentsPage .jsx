import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../Helpers/axiosInstance';
import toast from 'react-hot-toast';

const EnrolledStudentsPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('studentName');
    const [sortOrder, setSortOrder] = useState('asc');

    // Fetch enrolled students data
    useEffect(() => {
        fetchEnrolledStudents();
    }, []);

    const fetchEnrolledStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axiosInstance.get('/user/enrollments');
            
            if (response.data.success) {
                setEnrollments(response.data.data || []);
                toast.success(`Loaded ${response.data.totalEnrollments} enrollment records`);
            }
        } catch (err) {
            console.error('Error fetching enrolled students:', err);
            const errorMessage = err?.response?.data?.message || 'Failed to fetch enrolled students';
            setError(errorMessage);
            
            if (err?.response?.status === 404) {
                setEnrollments([]);
                toast.info('No enrolled students found');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories for filter dropdown
    const uniqueCategories = [...new Set(enrollments.map(enrollment => enrollment.course.category))];

    // Filter and sort enrollments
    const filteredAndSortedEnrollments = enrollments
        .filter(enrollment => {
            const matchesSearch = 
                enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !filterCategory || enrollment.course.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'studentName':
                    aValue = a.student.name.toLowerCase();
                    bValue = b.student.name.toLowerCase();
                    break;
                case 'studentEmail':
                    aValue = a.student.email.toLowerCase();
                    bValue = b.student.email.toLowerCase();
                    break;
                case 'courseTitle':
                    aValue = a.course.title.toLowerCase();
                    bValue = b.course.title.toLowerCase();
                    break;
                case 'category':
                    aValue = a.course.category.toLowerCase();
                    bValue = b.course.category.toLowerCase();
                    break;
                case 'price':
                    aValue = a.course.price;
                    bValue = b.course.price;
                    break;
                default:
                    return 0;
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) {
            return <span className="text-slate-400">↕️</span>;
        }
        return sortOrder === 'asc' ? <span className="text-blue-400">↑</span> : <span className="text-blue-400">↓</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <p className="ml-4 text-white text-lg">Loading enrolled students...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Enrolled Students
                    </h1>
                    <p className="text-slate-400">
                        {filteredAndSortedEnrollments.length} enrollment records found
                    </p>
                </motion.div>

                {/* Filters and Search */}
                {enrollments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 mb-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Search Students/Courses
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or course title..."
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Filter by Category
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {uniqueCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterCategory('');
                                        setSortBy('studentName');
                                        setSortOrder('asc');
                                    }}
                                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-900/50 border border-red-500 rounded-lg p-6 mb-6"
                    >
                        <h3 className="text-red-400 font-semibold text-lg mb-2">Error</h3>
                        <p className="text-red-300">{error}</p>
                        <button
                            onClick={fetchEnrolledStudents}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !error && enrollments.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800/50 border border-slate-600 rounded-lg p-12 text-center"
                    >
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Enrolled Students Found</h3>
                        <p className="text-slate-400 mb-4">
                            No users have enrolled in any courses yet.
                        </p>
                        <button
                            onClick={fetchEnrolledStudents}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Refresh
                        </button>
                    </motion.div>
                )}

                {/* Enrollments Table */}
                {!loading && filteredAndSortedEnrollments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700/50">
                                    <tr>
                                        <th 
                                            className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                                            onClick={() => handleSort('studentName')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Student Name {getSortIcon('studentName')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                                            onClick={() => handleSort('studentEmail')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Student Email {getSortIcon('studentEmail')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                                            onClick={() => handleSort('courseTitle')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Course Title {getSortIcon('courseTitle')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Category {getSortIcon('category')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                                            onClick={() => handleSort('price')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Price {getSortIcon('price')}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedEnrollments.map((enrollment, index) => (
                                        <motion.tr
                                            key={`${enrollment.student.email}-${enrollment.course.title}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-t border-slate-600 hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-white">
                                                <div className="font-medium">{enrollment.student.name}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {enrollment.student.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-white font-medium">
                                                    {enrollment.course.title}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                                                    {enrollment.course.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-white">
                                                {enrollment.course.price === 0 ? (
                                                    <span className="text-green-400 font-medium">Free</span>
                                                ) : (
                                                    <span className="font-medium">₹{enrollment.course.price.toLocaleString()}</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Table Footer */}
                        <div className="px-4 py-3 bg-slate-700/30 border-t border-slate-600">
                            <div className="flex items-center justify-between text-sm text-slate-400">
                                <span>
                                    Showing {filteredAndSortedEnrollments.length} of {enrollments.length} enrollments
                                </span>
                                {filteredAndSortedEnrollments.length !== enrollments.length && (
                                    <span>
                                        (Filtered results)
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default EnrolledStudentsPage;