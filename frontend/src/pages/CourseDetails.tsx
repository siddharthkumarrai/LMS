import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../Helpers/axiosInstance';
import { fetchCourseDetails } from '../redux/features/courses/courseSlice';
import { FaLock, FaPlayCircle, FaStar, FaClock, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';

interface LectureType {
  _id: string;
  name: string;
  duration: string;
  lecture: {
    lectureId: string;
    lectureUrl: string;
  };
}

interface CourseType {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: {
    thumbnailId: string;
    thumbnailUrl: string;
  };
  lectures: LectureType[];
}

interface UserDataType {
  subscriptions: string[];
}

interface RootState {
  auth: {
    data: UserDataType;
  };
  courses: {
    currentCourse: CourseType | null;
    loading: boolean;
    error: string | null;
  };
}

// 3D Card Components with Framer Motion
const CardContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`group/card ${className}`}
    style={{ perspective: "1000px" }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const CardBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`relative ${className}`}
    style={{ transformStyle: "preserve-3d" }}
    whileHover={{ rotateX: 5, rotateY: 5 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const CardItem = ({ 
  children, 
  translateZ = "0", 
  className = "", 
  as = "div",
  ...props 
}: { 
  children: React.ReactNode; 
  translateZ?: string; 
  className?: string; 
  as?: any;
  [key: string]: any;
}) => (
  <motion.div
    className={className}
    style={{ transform: `translateZ(${translateZ}px)` }}
    whileHover={{ transform: `translateZ(${parseInt(translateZ) + 10}px)` }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  
  // Redux state
  const { data: userData } = useSelector((state: RootState) => state.auth);
  const { currentCourse: course, loading, error } = useSelector((state: RootState) => state.courses);

  // Local state for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLecture, setModalLecture] = useState<LectureType | null>(null);

  const isSubscribed = !!userData?.subscriptions?.includes(courseId as string);

  // Fetch course data using Redux
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
    }
  }, [courseId, dispatch]);

  // Handle navigation errors
  useEffect(() => {
    if (error && !loading) {
      toast.error('Could not load course details.');
      navigate('/not-found');
    }
  }, [error, loading, navigate]);

  const handleBuyNow = () => {
    if (isSubscribed) {
      navigate(`/course/${courseId}/player`);
    } else {
      navigate(`/checkout/${courseId}`);
    }
  };

  // Modal handlers
  const openDemoModal = (lecture: LectureType) => {
    setModalLecture(lecture);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDemoModal = () => {
    setModalOpen(false);
    setModalLecture(null);
    document.body.style.overflow = '';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <motion.h1 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Course not found.
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto p-4 relative z-10">
        {/* Breadcrumb */}
        <motion.div 
          className="mb-8 text-sm flex items-center gap-2 mt-24 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AiOutlineHome className="text-purple-300 flex-shrink-0" size={18} />
          <span className="text-purple-300 flex-shrink-0">Home</span>
          <span className="text-purple-500 flex-shrink-0">{'>'}</span>
          <span className="text-purple-200 flex-shrink-0">Course</span>
          <span className="text-purple-500 flex-shrink-0">{'>'}</span>
          <span className="text-white font-semibold truncate min-w-0">
            {course.title.length > 50 ? `${course.title.substring(0, 50)}...` : course.title}
          </span>
        </motion.div>

        {/* Hero Section - 3D Cards */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16 items-start">
          {/* Course Info Card */}
          <CardContainer className="w-full">
            <CardBody className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl h-full flex flex-col">
              <CardItem translateZ="50">
                <motion.span 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 text-xs rounded-full font-bold inline-block mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  #Bestseller ⭐
                </motion.span>
              </CardItem>
              
              <CardItem translateZ="60" className="mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight break-words">
                  {course.title}
                </h1>
              </CardItem>
              
              <CardItem translateZ="40" className="flex-grow mb-6">
                <div className="text-purple-200 text-base sm:text-lg leading-relaxed">
                  <p className="break-words overflow-wrap-anywhere">
                    {course.description?.length > 200 
                      ? `${course.description.substring(0, 200)}...` 
                      : course.description}
                  </p>
                  {course.description?.length > 200 && (
                    <motion.button 
                      className="text-purple-400 hover:text-purple-300 text-sm mt-2 underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      Read more
                    </motion.button>
                  )}
                </div>
              </CardItem>

              {/* Stats Row */}
              <CardItem translateZ="30" className="mb-6">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm sm:text-base">
                    <FaStar />
                    <span className="font-semibold">4.8</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 text-sm sm:text-base">
                    <FaUsers />
                    <span className="font-semibold">12,543</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm sm:text-base">
                    <FaGraduationCap />
                    <span className="font-semibold">{course.lectures?.length || 0} Lectures</span>
                  </div>
                  {course.category && (
                    <div className="flex items-center gap-2 text-pink-400">
                      <span className="text-xs sm:text-sm px-2 py-1 bg-pink-500/20 rounded-full">
                        {course.category}
                      </span>
                    </div>
                  )}
                </div>
              </CardItem>

              <div className="mt-auto">
                <CardItem translateZ="50" className="mb-6">
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    Starting at ₹{course.price?.toLocaleString() || 'N/A'}/-
                  </p>
                </CardItem>

                <CardItem translateZ="60">
                  <motion.button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl text-base sm:text-lg shadow-xl"
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSubscribed ? 'Go to Course 🎓' : 'Buy Now 🚀'}
                  </motion.button>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>

          {/* Course Thumbnail Card */}
          <CardContainer className="w-full">
            <CardBody className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl h-full">
              <CardItem translateZ="100" className="relative group h-full">
                <div className="relative overflow-hidden rounded-xl h-full min-h-[300px] sm:min-h-[400px]">
                  <img
                    src={course.thumbnail?.thumbnailUrl || 'https://via.placeholder.com/600x300?text=Course+Thumbnail'}
                    alt={course.title || "Course thumbnail"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {course.lectures && course.lectures.length > 0 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => openDemoModal(course.lectures[0])}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FaPlayCircle className="text-white text-2xl sm:text-3xl" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Curriculum Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <CardContainer className="w-full">
            <CardBody className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
              <CardItem translateZ="50">
                <h2 className="text-center text-4xl font-bold text-white mb-12">
                  Course Curriculum
                </h2>
              </CardItem>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Module Info */}
                <CardItem translateZ="40" className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="text-purple-300 text-sm mb-2">Module 1</div>
                    <div className="text-white text-xl font-bold">All Lectures</div>
                    <div className="text-purple-200 text-sm mt-2">
                      {course.lectures?.length || 0} lessons • Complete course
                    </div>
                  </div>
                </CardItem>

                {/* Lectures List */}
                <CardItem translateZ="60" className="lg:col-span-2">
                  <div className="space-y-4">
                    {(!course.lectures || course.lectures.length === 0) ? (
                      <div className="text-purple-300 text-center py-8 text-base">
                        No lectures available yet.
                      </div>
                    ) : (
                      course.lectures.map((lecture, idx) => (
                        <motion.div
                          key={lecture._id}
                          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all duration-300"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02, translateZ: 20 }}
                        >
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">
                              Lecture {idx + 1}: {lecture.name}
                            </h3>
                            <div className="flex items-center gap-2 text-purple-300 text-sm mt-1">
                              <FaClock className="text-xs" />
                              <span>Duration: {lecture.duration}</span>
                            </div>
                          </div>

                          {idx === 0 ? (
                            // First lecture: always demo and open
                            <motion.button
                              title="Play Demo"
                              onClick={() => openDemoModal(lecture)}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaPlayCircle size={32} />
                            </motion.button>
                          ) : isSubscribed ? (
                            // Subscribed: allow play
                            <motion.button
                              title="Play"
                              onClick={() => navigate(`/course/${course._id}/player?lectureId=${lecture._id}`)}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaPlayCircle size={32} />
                            </motion.button>
                          ) : (
                            // Not subscribed: lock for all but first
                            <div className="relative group/tooltip">
                              <FaLock className="text-gray-500" size={24} />
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                                Purchase course to unlock
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </motion.div>

        {/* Demo Modal */}
        {modalOpen && modalLecture && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDemoModal}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white">{modalLecture.name}</h3>
                <motion.button
                  onClick={closeDemoModal}
                  className="text-gray-300 hover:text-white text-3xl"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Close"
                >
                  ×
                </motion.button>
              </div>
              <div className="p-6">
                {modalLecture.lecture.lectureUrl.endsWith('.mp4') ? (
                  <video
                    src={modalLecture.lecture.lectureUrl}
                    controls
                    autoPlay
                    className="rounded-xl w-full max-h-[60vh] mx-auto"
                    style={{ background: '#000' }}
                  />
                ) : (
                  <img 
                    src={modalLecture.lecture.lectureUrl} 
                    alt={modalLecture.name} 
                    className="rounded-xl w-full object-contain max-h-[60vh] mx-auto bg-black" 
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;