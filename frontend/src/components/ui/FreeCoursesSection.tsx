"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Clock, Users, ArrowRight, Loader2, AlertCircle, Eye, ShoppingCart, Sparkles, TrendingUp, BookOpen, Award, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchFreeCourses } from '../../redux/features/courses/courseSlice';
import toast from 'react-hot-toast';

// TypeScript interfaces
interface Course {
  _id: string;
  title: string;
  category: string;
  duration?: string;
  enrolled?: string;
  thumbnail: {
    thumbnailId?: string;
    thumbnailUrl?: string;
    secureUrl?: string;
  };
  rating?: number;
  level?: string;
  price: number;
  lectures?: any[];
  description?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  } | string;
}

// 3D Card Components
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
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Enhanced Course Card Component
const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => {
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const navigate = useNavigate();

  // Helper functions
  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getDuration = () => {
    if (course.lectures && course.lectures.length > 0) {
      const totalMinutes = course.lectures.reduce((total, lecture) => {
        const [minutes, seconds] = lecture.duration?.split(':').map(Number) || [0, 0];
        return total + minutes + (seconds / 60);
      }, 0);
      return `${Math.round(totalMinutes)} min`;
    }
    return "Self-paced";
  };

  const getEnrollmentCount = () => {
    if (course.enrolled) return course.enrolled;
    return Math.floor(Math.random() * 500 + 100) + "+ enrolled";
  };

  const getInstructorName = () => {
    if (typeof course.createdBy === 'object' && course.createdBy?.name) {
      return course.createdBy.name;
    }
    return 'Expert Instructor';
  };

  // Handle explore course
  const handleExplore = (courseId) => {
    setLoadingCourseId(courseId);
    setActionType('explore');
    
    setTimeout(() => {
      navigate(`/course/${courseId}`);
      toast('📚 Loading course details...', {
        icon: '🔍',
        duration: 2000,
      });
      setLoadingCourseId(null);
      setActionType(null);
    }, 300);
  };

  // Handle enroll
  const handleEnrollNow = (courseId) => {
    setLoadingCourseId(courseId);
    setActionType('enroll');
    
    setTimeout(() => {
      navigate(`/checkout/${courseId}?free=true`);
      toast.success('🎉 Redirecting to free enrollment...', {
        duration: 2000,
      });
      setLoadingCourseId(null);
      setActionType(null);
    }, 300);
  };

  return (
    <CardContainer className="inter-var">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{ 
          y: -4,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        <CardBody className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-gray-200 w-full h-auto rounded-xl p-6 border transition-all duration-300">
          
          {/* Price Badge */}
          <div className="absolute top-5 right-1 z-10">
            <CardItem translateZ="30">
              <span className="px-3 py-1 rounded-[0.5rem] text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {formatPrice(course.price)}
              </span>
            </CardItem>
          </div>

          {/* Category Badge - Only show if valid category exists */}
          {course.category && course.category !== course.title && course.category.length < 30 && (
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
            className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2 mt-8 min-h-[3rem]"
          >
            {course.title}
          </CardItem>
          
          <CardItem
            as="p"
            translateZ="60"
            className="text-gray-600 text-sm max-w-sm mt-2 dark:text-neutral-300 line-clamp-2 h-10"
          >
            {course.description || "Learn from industry experts and advance your skills with this comprehensive course."}
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
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {course.lectures?.length || 0} lectures
              </div>
              
              {/* Rating badge */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                {course.rating || (4.5 + Math.random() * 0.5).toFixed(1)}
              </div>
            </div>
          </CardItem>
          
          <div className="mt-4 mb-4">
            <CardItem
              translateZ="40"
              className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {getInstructorName()}
            </CardItem>
            
            {/* Course Stats */}
            <CardItem
              translateZ="40"
              className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getDuration()}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {getEnrollmentCount()}
              </span>
            </CardItem>
          </div>
          
          {/* Action Buttons */}
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
                  <Eye className="w-4 h-4" />
                  Explore
                </>
              )}
            </CardItem>
            
            <CardItem
              translateZ={20}
              as="button"
              onClick={() => handleEnrollNow(course._id)}
              disabled={loadingCourseId === course._id}
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loadingCourseId === course._id && actionType === 'enroll' ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Enroll Free
                </>
              )}
            </CardItem>
          </div>
        </CardBody>
      </motion.div>
    </CardContainer>
  );
};

// Error Component
const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <motion.div 
    className="flex flex-col items-center justify-center py-12 px-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Free Courses</h3>
    <p className="text-gray-600 text-center mb-4 max-w-md">{error}</p>
    <motion.button
      onClick={onRetry}
      className="px-6 py-2 bg-[#E97862] text-white rounded-lg font-medium hover:bg-[#d86b5a] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Try Again
    </motion.button>
  </motion.div>
);

// Loading Component
const LoadingDisplay: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden animate-pulse border border-gray-200 dark:border-gray-700">
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
    ))}
  </div>
);

// Empty State Component
const EmptyState: React.FC = () => (
  <motion.div 
    className="flex flex-col items-center justify-center py-12 px-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-6xl mb-4">📚</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Free Courses Available</h3>
    <p className="text-gray-600 text-center max-w-md">
      We're working on adding more free courses. Check back soon for exciting new content!
    </p>
  </motion.div>
);

// Main Component
const FreeCoursesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const courseState = useSelector((state: any) => state.courses);
  const { 
    freeCourses = [], 
    freeCoursesLoading = false, 
    error = null 
  } = courseState || {};

  // Fetch free courses when component mounts
  useEffect(() => {
    if (freeCourses.length === 0 && !freeCoursesLoading) {
      dispatch(fetchFreeCourses());
    }
  }, [dispatch, freeCourses.length, freeCoursesLoading]);

  // Debug: Log course data to check categories
  useEffect(() => {
    if (freeCourses.length > 0) {
      console.log('Free courses data:', freeCourses.map(course => ({
        title: course.title,
        category: course.category
      })));
    }
  }, [freeCourses]);

  const handleRetry = () => {
    dispatch(fetchFreeCourses());
  };

  // Handle View All button
  const handleViewAll = () => {
    navigate('/courses');
    toast('Navigating to all courses...', {
      icon: '🚀',
      duration: 2000,
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            100% Free Premium Courses!
            <Sparkles className="w-4 h-4" />
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Still Confused?{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Get Started With Free Courses!
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant access to our expertly crafted courses. No credit card required, just pure learning excellence!
          </p>
        </motion.div>

        {/* Course Count Info */}
        {!freeCoursesLoading && !error && freeCourses.length > 0 && (
          <motion.div 
            className="flex justify-start mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 backdrop-blur-sm border border-gray-200  rounded-xl px-6 py-2 shadow-sm">
              <span className="dark:text-white font-medium text-sm">
                {freeCourses.length} free course{freeCourses.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        <motion.div
          layout
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Loading State */}
          {freeCoursesLoading && <LoadingDisplay />}
          
          {/* Error State */}
          {error && !freeCoursesLoading && (
            <ErrorDisplay error={error} onRetry={handleRetry} />
          )}
          
          {/* Empty State */}
          {!freeCoursesLoading && !error && freeCourses.length === 0 && (
            <EmptyState />
          )}
          
          {/* Courses Grid */}
          {!freeCoursesLoading && !error && freeCourses.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300">
                <AnimatePresence mode="wait">
                  {freeCourses.map((course: Course, index: number) => (
                    <CourseCard 
                      key={course._id}
                      course={course} 
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* View All Button */}
              {freeCourses.length >= 6 && (
                <motion.div 
                  className="flex justify-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.button
                    onClick={handleViewAll}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All Courses
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FreeCoursesSection;