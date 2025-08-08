import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetails } from "../redux/features/courses/courseSlice";
import { 
    FaPlay, 
    FaPause, 
    FaCheck, 
    FaArrowLeft, 
    FaClock, 
    FaGraduationCap,
    FaChevronRight,
    FaCirclePlay
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

interface Lecture {
    _id: string;
    name: string;
    duration: string;
    lecture: { lectureUrl: string; };
}

const CoursePlayer: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse, loading } = useSelector((state: any) => state.courses);
    
    const [currentPlaying, setCurrentPlaying] = useState<Lecture | null>(null);
    const [completedLectures, setCompletedLectures] = useState<Record<string, boolean>>({});
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
        }
    }, [dispatch, courseId]);

    useEffect(() => {
        if (currentCourse?.lectures?.length > 0) {
            setCurrentPlaying(currentCourse.lectures[0]);
        }
    }, [currentCourse]);

    const handleMarkAsComplete = (lectureId: string) => {
        setCompletedLectures((prev) => ({ ...prev, [lectureId]: !prev[lectureId] }));
    };

    const getCompletionPercentage = () => {
        if (!currentCourse?.lectures?.length) return 0;
        const completed = Object.values(completedLectures).filter(Boolean).length;
        return Math.round((completed / currentCourse.lectures.length) * 100);
    };

    const handleNextLecture = () => {
        if (!currentCourse?.lectures || !currentPlaying) return;
        const currentIndex = currentCourse.lectures.findIndex((lec: Lecture) => lec._id === currentPlaying._id);
        if (currentIndex < currentCourse.lectures.length - 1) {
            setCurrentPlaying(currentCourse.lectures[currentIndex + 1]);
        }
    };

    const handlePrevLecture = () => {
        if (!currentCourse?.lectures || !currentPlaying) return;
        const currentIndex = currentCourse.lectures.findIndex((lec: Lecture) => lec._id === currentPlaying._id);
        if (currentIndex > 0) {
            setCurrentPlaying(currentCourse.lectures[currentIndex - 1]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <p className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Course...</p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Preparing your learning experience</p>
                </div>
            </div>
        );
    }

    if (!currentCourse || currentCourse.lectures?.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex flex-col justify-center items-center text-center p-8">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FaGraduationCap className="text-4xl text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {currentCourse?.title || 'Course'}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        No lectures have been added yet.
                    </p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            <div className="flex h-screen">
                {/* Modern Sidebar */}
                <aside className={`${sidebarOpen ? 'w-96' : 'w-16'} flex-shrink-0 transition-all duration-300 bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border-r border-white/20 dark:border-gray-700/50 shadow-xl`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <button 
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FaChevronRight className={`transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {sidebarOpen && (
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {getCompletionPercentage()}%
                                        </div>
                                        <div className="text-xs text-gray-500">completed</div>
                                    </div>
                                )}
                            </div>
                            
                            {sidebarOpen && (
                                <>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                                        {currentCourse.title}
                                    </h2>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${getCompletionPercentage()}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                        {Object.values(completedLectures).filter(Boolean).length} of {currentCourse.lectures.length} lectures completed
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Lectures List */}
                        <div className="flex-1 overflow-y-auto">
                            {sidebarOpen ? (
                                <div className="p-4 space-y-2">
                                    {currentCourse.lectures.map((lec: Lecture, idx: number) => (
                                        <button
                                            key={lec._id}
                                            onClick={() => setCurrentPlaying(lec)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group ${
                                                lec._id === currentPlaying?._id
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                                                    : "bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:scale-102"
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                    completedLectures[lec._id] 
                                                        ? 'bg-green-500 text-white' 
                                                        : lec._id === currentPlaying?._id
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                }`}>
                                                    {completedLectures[lec._id] ? (
                                                        <FaCheckCircle className="text-sm" />
                                                    ) : lec._id === currentPlaying?._id ? (
                                                        <FaCirclePlay className="text-sm" />
                                                    ) : (
                                                        <span className="text-sm font-semibold">{idx + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-semibold line-clamp-1 ${
                                                        lec._id === currentPlaying?._id ? 'text-white' : 'text-gray-800 dark:text-white'
                                                    }`}>
                                                        {lec.name}
                                                    </h3>
                                                    <div className={`flex items-center gap-1 mt-1 ${
                                                        lec._id === currentPlaying?._id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        <FaClock className="text-xs" />
                                                        <span className="text-xs">{lec.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2 space-y-2">
                                    {currentCourse.lectures.map((lec: Lecture, idx: number) => (
                                        <button
                                            key={lec._id}
                                            onClick={() => setCurrentPlaying(lec)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                lec._id === currentPlaying?._id
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {completedLectures[lec._id] ? (
                                                <FaCheckCircle className="text-green-500" />
                                            ) : (
                                                <span className="text-sm font-semibold">{idx + 1}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Video Player */}
                <main className="flex-1 flex flex-col">
                    {currentPlaying && (
                        <>
                            {/* Header */}
                            <header className="flex items-center gap-4 px-8 py-6 bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/50 shadow-sm">
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="group p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                                >
                                    <FaArrowLeft className="text-gray-600 dark:text-gray-300 group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
                                        {currentPlaying.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FaClock className="text-indigo-500 text-sm" />
                                        <span className="text-gray-600 dark:text-gray-300 text-sm">{currentPlaying.duration}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Lecture {currentCourse.lectures.findIndex((l: Lecture) => l._id === currentPlaying._id) + 1} of {currentCourse.lectures.length}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {getCompletionPercentage()}% Course Complete
                                    </div>
                                </div>
                            </header>

                            {/* Video Container */}
                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="max-w-6xl mx-auto">
                                    {/* Video Player */}
                                    <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden shadow-2xl bg-black">
                                        <video
                                            key={currentPlaying._id}
                                            controls 
                                            controlsList="nodownload"
                                            className="w-full h-full"
                                            src={currentPlaying.lecture.lectureUrl}
                                            poster="/api/placeholder/800/450"
                                        />
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                                        {/* Completion Checkbox */}
                                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!completedLectures[currentPlaying._id]}
                                                        onChange={() => handleMarkAsComplete(currentPlaying._id)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                                                        completedLectures[currentPlaying._id]
                                                            ? 'bg-green-500 border-green-500'
                                                            : 'border-gray-300 dark:border-gray-600 group-hover:border-green-400'
                                                    }`}>
                                                        {completedLectures[currentPlaying._id] && (
                                                            <FaCheck className="text-white text-xs absolute inset-1" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-lg font-medium text-gray-800 dark:text-white">
                                                    Mark as Complete
                                                </span>
                                            </label>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex gap-4 flex-1 justify-end">
                                            <button
                                                onClick={handlePrevLecture}
                                                disabled={currentCourse.lectures.findIndex((l: Lecture) => l._id === currentPlaying._id) === 0}
                                                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={handleNextLecture}
                                                disabled={currentCourse.lectures.findIndex((l: Lecture) => l._id === currentPlaying._id) === currentCourse.lectures.length - 1}
                                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 shadow-lg"
                                            >
                                                Next Lecture
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CoursePlayer;