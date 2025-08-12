"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Clock, Users, ArrowRight } from 'lucide-react';

// TypeScript interfaces
interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  enrolled: string;
  thumbnail: string;
  rating: number;
  level: string;
}

interface FilterTab {
  id: string;
  label: string;
  count: number;
}

// Sample course data
const coursesData: Course[] = [
  {
    id: '6890es9d348c1ea128cbe50da',
    title: 'Attacking Active Directory with Advanced Techniques With Lab',
    category: 'All',
    duration: '33 months',
    enrolled: '1000+ Enrolled',
    thumbnail: 'https://images.shiksha.com/mediadata/images/articles/1709716893phpMHu9M9.jpeg',
    rating: 4.8,
    level: 'Beginner'
  },
];

// Filter tabs
const filterTabs: FilterTab[] = [
  { id: 'All', label: 'All', count: coursesData.length },
//   { id: 'Stock Market', label: 'Stock Market', count: coursesData.filter(c => c.category === 'Stock Market').length },
//   { id: 'Tech Basics', label: 'Tech Basics', count: coursesData.filter(c => c.category === 'Tech Basics').length }
];

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

// Course Card Component - Exact Layout Match
const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        y: -4,
        boxShadow: "0px 4px 25px rgba(0,0,0,0.10)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="rounded-lg font-nunitoSans flex mt-5 relative shrink-0 flex-col bg-white cursor-pointer transition-all duration-500"
      style={{
        width: '302px',
        minHeight: '280px',
        padding: '0',
        margin: '0',
        borderRadius: '20px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      {/* Card Content */}
      <div className="flex flex-col flex-grow">
        {/* Image Section */}
        <div className="mx-auto w-full col-span-2 pt-4 px-4">
          <div className="relative">
            {/* Free Badge */}
            <div className="absolute top-0 left-0 z-[9999] ml-2 mt-2">
              <p className="text-[10px] leading-4 font-bold bg-[#E97862] text-white rounded-[56px] px-2 py-[2px]">
                Free
              </p>
            </div>
            
            {/* Course Image */}
            <img
              src={course.thumbnail}
              className="w-full rounded-[6px] h-[154px] object-cover"
              loading="eager"
              alt={course.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=E97862&color=fff&size=302x154`;
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between gap-4 flex-grow px-4 pb-4 pt-2">
          <div className="flex flex-col justify-between gap-2 h-full">
            {/* Title Section */}
            <div className="flex flex-row justify-between min-h-12">
              <p className="text-[16px] leading-6 font-bold text-gray-900 line-clamp-2 break-words">
                {course.title}
              </p>
            </div>

            {/* Metadata and Button Section */}
            <div className="flex flex-col gap-2">
              {/* Divider */}
              <div className="w-[270px] bg-[#EFEFEF] h-[1px]"></div>
              
              {/* Duration and Enrollment */}
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-sm leading-[22px] font-semibold text-black">
                    {course.duration }
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <p className="text-sm leading-[22px] font-semibold text-black">
                    {course.enrolled}
                  </p>
                </div>
              </div>

              {/* Enroll Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full font-extrabold mt-2 py-2 pl-[18px] pr-2 gap-0 z-10 border rounded-[4px] flex justify-center items-center transition-all duration-500 text-sm max-h-10 ${
                  isHovered 
                    ? 'bg-[#E97862] text-white border-[#E97862]' 
                    : 'bg-white text-[#E58471] border-[#E97862]'
                }`}
              >
                <p className="text-sm leading-[22px] font-semibold font-inter">
                  Enroll for Free
                </p>
                <ArrowRight className="w-6 h-6 ml-1" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const FreeCoursesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const filteredCourses = activeFilter === 'All' 
    ? coursesData 
    : coursesData.filter(course => course.category === activeFilter);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
    >
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6  mt-[-8rem]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-base sm:text-lg">🎓</span>
            Free Courses!
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-4 sm:px-0">
            Still Confused? Get Started With{' '}
            <span className="text-[#E97862]">Free Courses!</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Choose from our expertly curated free courses and start your learning journey today.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center sm:justify-start gap-18 sm:gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filterTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 sm:px-4 md:px-18 py-2 sm:py-3 rounded-[10px] font-medium text-xs sm:text-sm md:text-base transition-all duration-300 border ${
                activeFilter === tab.id
                  ? 'bg-[#f37f68] text-white border-[#E97862] shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#E97862] hover:text-[#E97862]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Responsive Cards Container */}
        <motion.div
          layout
          className="relative overflow-hidden flex flex-col gap-6 pl-[2px] large:px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex flex-wrap justify-start gap-4 md:gap-6 transition-all duration-300">
            <AnimatePresence mode="wait">
              {filteredCourses.map((course, index) => (
                <CourseCard 
                  key={`${activeFilter}-${course.id}`}
                  course={course} 
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeCoursesSection;
