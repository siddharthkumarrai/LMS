import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { fetchCourseDetails, addLectureToCourse, deleteLectureFromCourse } from '../redux/features/courses/courseSlice';
import { FaPlus, FaTrash, FaPlay, FaClock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

// 3D Card Components
const CardContainer = ({ children, className }) => {
  return (
    <div className={`py-10 ${className}`}>
      <div
        className="relative group perspective-1000"
        style={{
          transform: 'perspective(1000px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const CardBody = ({ children, className }) => {
  return (
    <div
      className={`transform-style-preserve-3d transition-transform duration-300 ease-out hover:rotate-y-5 hover:rotate-x-5 ${className}`}
    >
      {children}
    </div>
  );
};

const CardItem = ({ children, translateZ = "0", className, as: Component = "div", ...props }) => {
  const style = {
    transform: `translateZ(${translateZ}px)`,
  };
  
  return (
    <Component className={className} style={style} {...props}>
      {children}
    </Component>
  );
};

const ManageLectures = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentCourse, loading } = useSelector((state) => state.courses);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingLectureId, setDeletingLectureId] = useState(null);

   
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', duration: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
        }
    }, [dispatch, courseId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
            setDeletingLectureId(lectureId);
            
            try {
                // Actual API call
                const result = await dispatch(deleteLectureFromCourse({ courseId, lectureId }));
                
                if (deleteLectureFromCourse.fulfilled.match(result)) {
                    // Success case - toast already handled in thunk
                    console.log('Lecture deleted successfully');
                } else {
                    // If rejected, error toast already handled in thunk
                    console.log('Delete failed');
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete lecture');
            } finally {
                setDeletingLectureId(null);
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.duration || !videoFile) {
            return toast.error("All fields are required");
        }

        setIsUploading(true);

        const lectureData = new FormData();
        lectureData.append('name', formData.name);
        lectureData.append('duration', formData.duration);
        lectureData.append('lecture', videoFile);

        try {
            const result = await dispatch(addLectureToCourse({ courseId, formData: lectureData }));
           
            if (addLectureToCourse.fulfilled.match(result)) {
                setFormData({ name: '', duration: '' });
                setVideoFile(null);
                setVideoPreview('');
                setIsFormVisible(false);
            }
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Loading Course Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        {currentCourse?.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Manage your course lectures with style
                    </p>
                    <button 
                        onClick={() => setIsFormVisible(!isFormVisible)} 
                        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                    >
                        <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
                        {isFormVisible ? 'Cancel' : 'Add New Lecture'}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"></div>
                    </button>
                </div>

                {/* Add Lecture Form */}
                {isFormVisible && (
                    <CardContainer className="mb-12">
                        <CardBody className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-2xl max-w-2xl mx-auto">
                            <div className="p-8">
                                <CardItem translateZ="50" className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                    Create New Lecture
                                </CardItem>
                                <CardItem translateZ="30" className="text-gray-600 dark:text-gray-300 mb-8">
                                    Add engaging content to your course
                                </CardItem>
                                
                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <CardItem translateZ="40">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="Lecture Title" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                                            required 
                                        />
                                    </CardItem>
                                    
                                    <CardItem translateZ="40">
                                        <input 
                                            type="text" 
                                            name="duration" 
                                            placeholder="Duration (e.g., 10:30)" 
                                            value={formData.duration} 
                                            onChange={handleInputChange} 
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                                            required 
                                        />
                                    </CardItem>
                                    
                                    <CardItem translateZ="60" className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <input 
                                            type="file" 
                                            accept="video/*" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current.click()} 
                                            className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform duration-300"
                                        >
                                            Choose Video File
                                        </button>
                                        {videoPreview && (
                                            <video 
                                                src={videoPreview} 
                                                controls 
                                                className="mt-6 w-full rounded-2xl shadow-lg"
                                            />
                                        )}
                                    </CardItem>

                                    <CardItem translateZ="40">
                                        <button 
                                            type="submit" 
                                            disabled={isUploading}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <FaSpinner className="animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                'Upload Lecture'
                                            )}
                                        </button>
                                    </CardItem>
                                </form>
                            </div>
                        </CardBody>
                    </CardContainer>
                )}

                {/* Lectures Grid */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
                        Course Lectures
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                        {currentCourse?.lectures?.length || 0} lectures available
                    </p>
                </div>

                {currentCourse?.lectures?.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentCourse.lectures.map((lecture, index) => (
                                <CardContainer key={lecture._id} className="inter-var">
                                    <CardBody className="bg-white/80 backdrop-blur-xl relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-gray-900/80 dark:border-gray-700/50 border-gray-200/50 w-full h-auto rounded-3xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300">
                                        <CardItem
                                            translateZ="50"
                                            className="text-xl font-bold text-gray-800 dark:text-white mb-2"
                                        >
                                            Lecture {index + 1}
                                        </CardItem>
                                        
                                        <CardItem
                                            translateZ="60"
                                            className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4"
                                        >
                                            {lecture.name}
                                        </CardItem>

                                        <CardItem translateZ="100" className="w-full mb-6">
                                            <div className="relative h-48 rounded-2xl overflow-hidden group-hover/card:shadow-xl transition-shadow duration-300 bg-black">
                                                {lecture.lecture?.lectureUrl || lecture.lectureUrl ? (
                                                    <>
                                                        <video 
                                                            src={lecture.lecture?.lectureUrl || lecture.lectureUrl}
                                                            className="w-full h-full object-cover"
                                                            preload="metadata"
                                                            muted
                                                            onLoadedMetadata={(e) => {
                                                                // Set current time to 1 second to show a frame
                                                                e.currentTarget.currentTime = 1;
                                                            }}
                                                            onError={() => {
                                                                console.log('Video failed to load:', lecture.lecture?.lectureUrl || lecture.lectureUrl);
                                                            }}
                                                        />
                                                        {/* Play overlay */}
                                                        <div 
                                                            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 cursor-pointer"
                                                            onClick={() => {
                                                                const videoSrc = lecture.lecture?.lectureUrl || lecture.lectureUrl;
                                                                const video = document.querySelector(`video[src="${videoSrc}"]`);
                                                                if (video) {
                                                                    if (video.paused) {
                                                                        video.play();
                                                                    } else {
                                                                        video.pause();
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                                                                <FaPlay className="text-white text-2xl" />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 h-full flex items-center justify-center">
                                                        <div className="text-center">
                                                            <FaPlay className="text-6xl text-blue-500 mb-4 mx-auto opacity-60" />
                                                            <p className="text-gray-600 dark:text-gray-300 font-medium">Video Lecture</p>
                                                            <p className="text-xs text-gray-500 mt-1">No video available</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardItem>

                                        <div className="flex justify-between items-center">
                                            <CardItem
                                                translateZ={20}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
                                            >
                                                <FaClock />
                                                {lecture.duration}
                                            </CardItem>
                                            
                                            <div className="flex gap-2">
                                                {/* View/Play Button */}
                                                <CardItem
                                                    translateZ={20}
                                                    as="button"
                                                    className="p-3 rounded-xl bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-600 dark:text-green-400 transition-colors duration-300 group"
                                                    onClick={() => {
                                                        if (lecture.lecture?.lectureUrl || lecture.lectureUrl) {
                                                            navigate(`/course/${courseId}/player`);
                                                        }
                                                    }}
                                                >
                                                    <FaPlay className="group-hover:scale-110 transition-transform duration-300" />
                                                </CardItem>
                                                
                                                <CardItem
                                                    translateZ={20}
                                                    as="button"
                                                    className="p-3 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 transition-colors duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => handleDeleteLecture(lecture._id)}
                                                    disabled={deletingLectureId === lecture._id}
                                                >
                                                    {deletingLectureId === lecture._id ? (
                                                        <FaSpinner className="animate-spin transition-transform duration-300" />
                                                    ) : (
                                                        <FaTrash className="group-hover:scale-110 transition-transform duration-300" />
                                                    )}
                                                </CardItem>
                                            </div>
                                        </div>
                                    </CardBody>
                                </CardContainer>
                            ))}
                        </div>
                    </>
                ) : (
                    <CardContainer>
                        <CardBody className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-xl max-w-md mx-auto">
                            <div className="p-12 text-center">
                                <CardItem translateZ="50" className="text-6xl text-gray-400 dark:text-gray-600 mb-6">
                                    📚
                                </CardItem>
                                <CardItem translateZ="40" className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                    No Lectures Yet
                                </CardItem>
                                <CardItem translateZ="30" className="text-gray-500 dark:text-gray-400">
                                    Start by adding your first lecture to this course
                                </CardItem>
                            </div>
                        </CardBody>
                    </CardContainer>
                )}
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-preserve-3d {
                    transform-style: preserve-3d;
                }
                .hover\\:rotate-y-5:hover {
                    transform: rotateY(5deg) rotateX(5deg);
                }
            `}</style>
        </div>
    );
};

export default ManageLectures;