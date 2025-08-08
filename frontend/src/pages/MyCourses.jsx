import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchMyCreatedCourses, fetchMySubscribedCourses } from '../redux/features/courses/courseSlice';
import { FaQuestionCircle } from 'react-icons/fa';

// =================================================================
// COMPONENT 1: Optimized Course Card
// =================================================================

const CourseCard = ({ course, role }) => {
    const navigate = useNavigate();

    const instructorName = course.createdBy?.name || 'Unknown Instructor';
    const thumbnailUrl = course.thumbnail?.secureUrl || 'https://placehold.co/600x400?text=No+Image';
    const description = course.description || 'No description available.';

    // Admin ke liye card par click karne ka function
    const handleCardClickForAdmin = () => {
        navigate(`/course/${course._id}/player`);
    };

    const CardInnerContent = (
        <>
            {/* Left Side: Image */}
            <div className="w-1/3 flex-shrink-0">
                <img className="w-full h-full object-cover" src={thumbnailUrl} alt={course.title} />
            </div>

            {/* Right Side: Content */}
            <div className="w-2/3 p-4 flex flex-col">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={course.title}>
                        {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2" title={description}>
                        {description}
                    </p>
                </div>

                <div className="mt-4 flex-shrink-0">
                    {role === 'USER' ? (
                        <button
                            onClick={() => navigate(`/course/${course._id}/player`)}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        >
                            Start Learning
                        </button>
                    ) : ( // For ADMIN
                        <div className="flex gap-2 text-sm">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Naye page par bhejo
                                    navigate(`/course/manage-lectures/${course._id}`);
                                }}
                                className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-md hover:bg-yellow-600"
                            >
                                Update
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Zaroori hai taaki card ka click na chale
                                    // Delete logic
                                }}
                                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    // Role ke hisaab se card ko render karo
    if (role === 'ADMIN') {
        // Admin ke liye, poora card ek clickable div hai
        return (
            <div
                onClick={handleCardClickForAdmin}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex overflow-hidden group transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
                {CardInnerContent}
            </div>
        );
    }

    // User ke liye card ek normal non-clickable div hai
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex overflow-hidden group">
            {CardInnerContent}
        </div>
    );
};



// =================================================================
// MAIN PAGE COMPONENT (Refactored and Clean)
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

    if (loading) {
        return <div className="text-center text-lg p-10">Loading Your Courses...</div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-950 min-h-full text-gray-800 dark:text-gray-200">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                    <div className="flex space-x-4 mb-6">
                        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-transparent'}`}>All</button>
                        <button onClick={() => setActiveTab('progress')} className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-transparent'}`}>In Progress</button>
                    </div>
                    <div className="space-y-6">
                        {myCourses?.length > 0 ? (
                            myCourses.map(course => (
                                // Role yahan se prop olarak pass ho raha hai
                                <CourseCard key={course._id} course={course} role={isAdminOrInstructor ? 'ADMIN' : 'USER'} />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold">No Courses Found</h3>
                                <p className="text-gray-500 mt-2">
                                    {isAdminOrInstructor ? 'You have not created any courses yet.' : 'You have not subscribed to any courses yet.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full lg:w-80 lg:flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="font-bold mb-4">Skills Report</h3>
                        <div className="flex flex-col items-center text-center p-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="font-bold text-lg text-blue-500">COMING SOON</p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Something Cool is being prepared</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
                <div className="flex items-center">
                    <FaQuestionCircle className="text-4xl text-orange-500 mr-4" />
                    <div>
                        <h3 className="font-bold">Got questions? We are always here for you!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Feel free to reach out.</p>
                    </div>
                </div>
                <button className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-semibold px-6 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-900">Request a Callback</button>
            </div>
        </div>
    );
};

export default MyCoursesPage;