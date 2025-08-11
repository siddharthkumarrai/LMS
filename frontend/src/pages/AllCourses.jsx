import React, { useState, useEffect, useCallback } from 'react';
import './AllCourses.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchAllCourses } from '../redux/features/courses/courseSlice';

// 3D Card Components (simplified version)
const CardContainer = ({ children, className = '' }) => (
    <div className={`perspective-1000 ${className}`}>
        {children}
    </div>
);

const CardBody = ({ children, className = '' }) => (
    <div className={`transform-style-preserve-3d transition-transform duration-300 hover:rotateY-5 ${className}`}>
        {children}
    </div>
);

const CardItem = ({ children, translateZ = 0, as: Component = 'div', className = '', ...props }) => {
    const translateStyle = translateZ ? { transform: `translateZ(${translateZ}px)` } : {};
    return (
        <Component 
            className={`transition-transform duration-300 hover:translateZ-${translateZ} ${className}`}
            style={translateStyle}
            {...props}
        >
            {children}
        </Component>
    );
};

const AllCourses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { 
        allCourses, 
        searchLoading, 
        totalPages, 
        currentPage, 
        totalCourses 
    } = useSelector((state) => state.courses);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [loadingCourseId, setLoadingCourseId] = useState(null);
    const [actionType, setActionType] = useState(null); // 'explore' or 'buy'

    // Debounce hook
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setActivePage(1); // Reset to first page when searching
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch courses when component mounts, search term changes, or page changes
    useEffect(() => {
        dispatch(fetchAllCourses({ 
            searchQuery: debouncedSearchTerm, 
            page: activePage, 
            limit: 9 
        }));
    }, [dispatch, debouncedSearchTerm, activePage]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handlePageChange = (page) => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExplore = (courseId) => {
        setLoadingCourseId(courseId);
        setActionType('explore');
        
        // Add a small delay for better UX (optional)
        setTimeout(() => {
            navigate(`/course/${courseId}`);
            setLoadingCourseId(null);
            setActionType(null);
        }, 300);
    };

    const handleBuyNow = (courseId) => {
        setLoadingCourseId(courseId);
        setActionType('buy');
        
        // Add a small delay for better UX (optional)
        setTimeout(() => {
            navigate(`/checkout/${courseId}`);
            setLoadingCourseId(null);
            setActionType(null);
        }, 300);
    };

// Enhanced Course Card with Price and Better Information Display
const CourseCard = ({ course }) => {
    const formatPrice = (price) => {
        if (price === 0) return 'Free';
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <CardContainer className="inter-var">
            <CardBody className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.1] dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-gray-200 w-full h-auto rounded-xl p-6 border transition-all duration-300">
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <CardItem translateZ="30">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            course.price === 0 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                            {formatPrice(course.price)}
                        </span>
                    </CardItem>
                </div>

                {/* Category Badge */}
                {course.category && (
                    <div className="absolute top-4 left-4 z-10">
                        <CardItem translateZ="30">
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md text-xs font-medium">
                                {course.category}
                            </span>
                        </CardItem>
                    </div>
                )}
                
                <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1 mt-8"
                >
                    {course.title}
                </CardItem>
                
                <CardItem
                    as="p"
                    translateZ="60"
                    className="text-gray-600 text-sm max-w-sm mt-2 dark:text-neutral-300 line-clamp-2 h-10"
                >
                    {course.description}
                </CardItem>
                
                <CardItem translateZ="100" className="w-full mt-4">
                    <div className="relative overflow-hidden rounded-xl">
                        <img
                            src={course.thumbnail?.thumbnailUrl || course.thumbnail?.secureUrl || '/api/placeholder/400/250'}
                            height="250"
                            width="400"
                            className="h-48 w-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                            alt={course.title}
                            onError={(e) => {
                                e.target.src = '/api/placeholder/400/250';
                            }}
                        />
                        {/* Overlay with lecture count */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                            {course.lectures?.length || 0} lectures
                        </div>
                    </div>
                </CardItem>
                
                <div className="mt-4 mb-4">
                    <CardItem
                        translateZ="40"
                        className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {typeof course.createdBy === 'object' 
                            ? course.createdBy?.name 
                            : 'Unknown Instructor'
                        }
                    </CardItem>
                    
                    {/* Course Stats */}
                    <CardItem
                        translateZ="40"
                        className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-4"
                    >
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.lectures?.length || 0} lessons
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {/* Calculate total duration if available */}
                            Total: {course.lectures?.reduce((total, lecture) => {
                                const [minutes, seconds] = lecture.duration?.split(':').map(Number) || [0, 0];
                                return total + minutes + (seconds / 60);
                            }, 0).toFixed(0) || 0}min
                        </span>
                    </CardItem>
                </div>
                
                <div className="flex justify-between items-center mt-6 gap-3">
                    <CardItem
                        translateZ={20}
                        as="button"
                        onClick={() => handleExplore(course._id)}
                        disabled={loadingCourseId === course._id}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-normal text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loadingCourseId === course._id && actionType === 'explore' ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Explore
                            </>
                        )}
                    </CardItem>
                    <CardItem
                        translateZ={20}
                        as="button"
                        onClick={() => handleBuyNow(course._id)}
                        disabled={loadingCourseId === course._id}
                        className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {loadingCourseId === course._id && actionType === 'buy' ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Processing...
                            </>
                        ) : course.price === 0 ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Enroll Free
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Buy Now
                            </>
                        )}
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
};

    const LoadingSkeleton = () => (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden animate-pulse border border-gray-200 dark:border-gray-700">
            <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="flex justify-between items-center mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
            </div>
        </div>
    );

    const Pagination = () => {
        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                }
            }
            return pages;
        };

        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...' || page === currentPage}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                            page === currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : page === '...'
                                ? 'cursor-default border-gray-300 dark:border-gray-600'
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        All Courses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our comprehensive collection of courses designed to help you learn new skills and advance your career.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg 
                                className="h-5 w-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search courses by title or description..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        />
                        {searchLoading && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin h-5 w-5 text-blue-500">
                                    <svg fill="none" viewBox="0 0 24 24">
                                        <circle 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4" 
                                            className="opacity-25"
                                        />
                                        <path 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                                            className="opacity-75"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Info */}
                {!searchLoading && (
                    <div className="mb-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            {debouncedSearchTerm && allCourses.length > 0 
                                ? `Found ${totalCourses} course${totalCourses === 1 ? '' : 's'} for "${debouncedSearchTerm}" (Page ${currentPage} of ${totalPages})`
                                : debouncedSearchTerm && allCourses.length === 0
                                ? `No courses found for "${debouncedSearchTerm}"`
                                : `Showing ${allCourses.length} of ${totalCourses} courses (Page ${currentPage} of ${totalPages})`
                            }
                        </p>
                    </div>
                )}

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchLoading ? (
                        // Loading skeletons
                        Array.from({ length: 9 }, (_, index) => (
                            <LoadingSkeleton key={index} />
                        ))
                    ) : allCourses.length > 0 ? (
                        // Actual courses
                        allCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))
                    ) : (
                        // No courses found
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg 
                                    className="mx-auto h-16 w-16" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={1} 
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No courses found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {debouncedSearchTerm 
                                    ? "Try adjusting your search terms or browse all available courses." 
                                    : "No courses are currently available."
                                }
                            </p>
                            {debouncedSearchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination />
            </div>
        </div>
    );
};

export default AllCourses;