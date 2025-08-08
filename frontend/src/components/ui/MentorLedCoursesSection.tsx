"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../../redux/features/courses/courseSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...classes: string[]) => twMerge(clsx(...classes));

// Course categories with their mapping to search terms
const courseCategories = [
  {
    id: 1,
    title: "Data Science & Analytics",
    description: "Choose your career path & explore our wide range of course that helps you grow.",
    icon: "📊",
    color: "bg-purple-600",
    searchTerms: ["data", "analytics", "science", "AI", "machine learning"]
  },
  {
    id: 2,
    title: "Software Development",
    description: "Master modern web development with industry-leading frameworks.",
    icon: "💻",
    color: "bg-blue-600",
    searchTerms: ["web", "development", "react", "javascript", "programming", "full stack"]
  },
  {
    id: 3,
    title: "Digital Marketing With AI",
    description: "Learn AI-powered marketing strategies and growth hacking.",
    icon: "📱",
    color: "bg-yellow-500",
    searchTerms: ["marketing", "digital", "social media", "growth"]
  },
  {
    id: 4,
    title: "Programming Courses",
    description: "Learn programming languages and algorithmic thinking.",
    icon: "⌨️", 
    color: "bg-orange-500",
    searchTerms: ["python", "java", "programming", "coding", "algorithms"]
  },
  {
    id: 5,
    title: "Cybersecurity Courses",
    description: "Ethical hacking and cybersecurity fundamentals.",
    icon: "🔒",
    color: "bg-indigo-600", 
    searchTerms: ["security", "hacking", "cyber", "ethical"]
  },
  {
    id: 6,
    title: "Product Management",
    description: "Strategic product development and agile methodologies.",
    icon: "📈",
    color: "bg-pink-600",
    searchTerms: ["product", "management", "strategy", "agile"]
  },
  {
    id: 7,
    title: "Banking & Finance",
    description: "Financial analysis and banking sector expertise.",
    icon: "💰",
    color: "bg-green-600",
    searchTerms: ["finance", "banking", "investment", "financial"]
  }
];

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: { thumbnailUrl: string };
  lectures: any[];
  price: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
}

const MentorLedCoursesSection = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state with proper type safety and fallbacks
const { 
    allCourses = [], 
    searchLoading = false, 
    loading = false,
    error = null 
} = useSelector((state: any) => {
    console.log('🔍 Current Redux course state:', state?.courses);
    return state?.courses || {};
});
  
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [categoryCourses, setCategoryCourses] = useState<{ [key: number]: Course[] }>({});
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('Redux State Debug:', {
      allCourses,
      searchLoading,
      loading,
      allCoursesLength: allCourses?.length || 0
    });
  }, [allCourses, searchLoading, loading]);

  // Fetch featured courses on component mount
  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        console.log('Dispatching fetchAllCourses...');
        setIsInitialLoad(true);
        
        // Dispatch without any search parameters to get all courses
        const resultAction = await dispatch(fetchAllCourses({ page: 1, limit: 10 }) as any);
        
        console.log('fetchAllCourses result:', resultAction);
        
        // Check if the action was fulfilled
        if (fetchAllCourses.fulfilled.match(resultAction)) {
          console.log('Courses loaded successfully:', resultAction.payload);
        } else if (fetchAllCourses.rejected.match(resultAction)) {
          console.error('Failed to load courses:', resultAction.error);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadFeaturedCourses();
  }, [dispatch]);

  // Update featured courses when allCourses changes
  useEffect(() => {
    console.log('allCourses changed:', allCourses);
    if (allCourses && Array.isArray(allCourses) && allCourses.length > 0) {
      setFeaturedCourses(allCourses);
      console.log('Featured courses updated:', allCourses);
    } else {
      console.log('No courses found or invalid data structure');
    }
  }, [allCourses]);

  // Function to fetch courses for a specific category
  const fetchCategoryCoursesOnHover = async (categoryId: number) => {
    // If already fetched, don't fetch again
    if (categoryCourses[categoryId]) return;

    const category = courseCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    try {
      // Search using the first search term for the category
      const searchTerm = category.searchTerms[0];
      const resultAction = await dispatch(fetchAllCourses({ 
        searchQuery: searchTerm, 
        page: 1, 
        limit: 6 
      }) as any);
      
      if (fetchAllCourses.fulfilled.match(resultAction) && resultAction.payload?.courses) {
        setCategoryCourses(prev => ({
          ...prev,
          [categoryId]: resultAction.payload.courses
        }));
      }
    } catch (error) {
      console.error(`Error fetching courses for category ${categoryId}:`, error);
    }
  };

  // Handle category hover
  const handleCategoryHover = (categoryId: number) => {
    setHoveredCategory(categoryId);
    fetchCategoryCoursesOnHover(categoryId);
  };

  // Handle course navigation
  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  // Handle view all category courses
  const handleViewAllCategory = (category: any) => {
    // Navigate to courses page with search filter
    navigate(`/all-courses`);
  };

  // Calculate course duration from lectures
  const calculateDuration = (lectures: any[]) => {
    if (!lectures || lectures.length === 0) return "Self-paced";
    return `${lectures.length} lectures`;
  };

  // Get enrollment count (placeholder since not in schema)
  const getEnrollmentCount = () => {
    return `${Math.floor(Math.random() * 1000) + 100}+ Enrolled`;
  };

  // Get creator name
  const getCreatorName = (createdBy: any) => {
    if (typeof createdBy === 'string') return 'Instructor';
    return createdBy?.name || 'Instructor';
  };

  // Format price
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Free';
    return `₹${price.toLocaleString()}`;
  };

  // Get badge based on course data
  const getBadge = (course: Course, index: number) => {
    const badges = ['Bestseller', 'Popular', 'New', 'High Demand'];
    if (index < 3) return badges[index];
    return null;
  };

  // Debug render conditions
  const shouldShowLoading = (isInitialLoad && searchLoading) || (featuredCourses.length === 0 && searchLoading);
  const shouldShowNoCourses = !shouldShowLoading && featuredCourses.length === 0;
  const shouldShowCourses = !shouldShowLoading && featuredCourses.length > 0;

  console.log('Render conditions:', {
    isInitialLoad,
    searchLoading,
    featuredCoursesLength: featuredCourses.length,
    shouldShowLoading,
    shouldShowNoCourses,
    shouldShowCourses
  });

  return (
    <section className={cn(
      "relative w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24",
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium my-14">
            <span>🌟</span>
            Explore Our Courses
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Mentor-Led Courses
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Choose your career path & explore our wide range of specialized courses that helps you grow.
          </p>
        </motion.div>

        {/* Navbar Style Categories with Tooltip/Carousel */}
        <div className="relative mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {courseCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Category Button/Card */}
                  <motion.div
                    className="group bg-gray-50 hover:bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleViewAllCategory(category)}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-xl mb-3 group-hover:scale-105 transition-transform duration-300`}>
                      {category.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  </motion.div>

                  {/* Tooltip/Carousel on Hover */}
                  <AnimatePresence>
                    {hoveredCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50"
                        style={{ 
                          left: category.id > 4 ? 'auto' : '0',
                          right: category.id > 4 ? '0' : 'auto'
                        }}
                      >
                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-900 mb-1">{category.title}</h4>
                          <p className="text-xs text-gray-600">Available Courses</p>
                        </div>
                        
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {searchLoading ? (
                            // Loading skeleton
                            Array(3).fill(0).map((_, i) => (
                              <div key={i} className="flex gap-3 p-2 rounded-lg animate-pulse">
                                <div className="w-16 h-10 bg-gray-300 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                </div>
                              </div>
                            ))
                          ) : categoryCourses[category.id] && categoryCourses[category.id].length > 0 ? (
                            categoryCourses[category.id].map((course, index) => (
                              <div 
                                key={course._id} 
                                className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleCourseClick(course._id)}
                              >
                                <img
                                  src={course.thumbnail?.thumbnailUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=f3f4f6&color=374151&size=64x40&format=png`}
                                  alt={course.title}
                                  className="w-16 h-10 object-cover rounded-lg flex-shrink-0"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=f3f4f6&color=374151&size=64x40&format=png`;
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-gray-900 line-clamp-1">{course.title}</h5>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>{calculateDuration(course.lectures)}</span>
                                    <span>•</span>
                                    <span>{getEnrollmentCount()}</span>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-600">by {getCreatorName(course.createdBy)}</span>
                                    <span className="text-sm font-semibold text-green-600">{formatPrice(course.price)}</span>
                                  </div>
                                  {getBadge(course, index) && (
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                                      getBadge(course, index) === 'Bestseller' ? 'bg-green-100 text-green-700' :
                                      getBadge(course, index) === 'Popular' ? 'bg-blue-100 text-blue-700' :
                                      getBadge(course, index) === 'New' ? 'bg-purple-100 text-purple-700' :
                                      getBadge(course, index) === 'High Demand' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {getBadge(course, index)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No courses found
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button 
                            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => handleViewAllCategory(category)}
                          >
                            View All {category.title} →
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Featured Courses
            </h2>
            <p className="text-gray-600">
              Explore our most popular mentor-led courses with hands-on projects
            </p>
          </div>

          {/* Horizontal Scrolling Course Cards */}
          <div className="p-8">
            {shouldShowLoading ? (
              // Loading skeleton for initial load
              <div className="flex gap-6 overflow-x-auto pb-4">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-80 h-[420px] bg-gray-200 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : shouldShowNoCourses ? (
              // No courses message
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No courses available at the moment</div>
                <p className="text-gray-400">Please check back later for new courses</p>
                <button 
                  onClick={() => {
                    console.log('Retry button clicked');
                    dispatch(fetchAllCourses({ page: 1, limit: 10 }) as any);
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Retry Loading Courses
                </button>
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {featuredCourses.map((course, courseIndex) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: courseIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80 h-[420px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer"
                    onClick={() => handleCourseClick(course._id)}
                  >
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnail?.thumbnailUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=f3f4f6&color=374151&size=320x192&format=png`}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=f3f4f6&color=374151&size=320x192&format=png`;
                        }}
                      />
                      
                      {/* Badge */}
                      {getBadge(course, courseIndex) && (
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            getBadge(course, courseIndex) === 'Bestseller' ? 'bg-green-500 text-white' :
                            getBadge(course, courseIndex) === 'Popular' ? 'bg-blue-500 text-white' :
                            getBadge(course, courseIndex) === 'New' ? 'bg-purple-500 text-white' :
                            getBadge(course, courseIndex) === 'High Demand' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {getBadge(course, courseIndex)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-12 flex items-start">
                        {course.title}
                      </h3>
                      
                      {/* Creator name */}
                      <p className="text-sm text-gray-600 mb-3">
                        by {getCreatorName(course.createdBy)}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{calculateDuration(course.lectures)}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="truncate">{getEnrollmentCount()}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-green-600">{formatPrice(course.price)}</span>
                      </div>

                      <button 
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course._id);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* View All Button */}
          <Link to={`/all-courses`}>          
          <div className="text-gray-700 font-medium hover:text-gray-900 
              transition-colors flex items-center gap-2 px-8 pb-8">
              View All Courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
          </div>
          </Link>

        </motion.div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </section>
  );
};

export default MentorLedCoursesSection;