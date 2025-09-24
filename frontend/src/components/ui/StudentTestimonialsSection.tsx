"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...classes: string[]) => twMerge(clsx(...classes));

// Type definitions remain same
interface Testimonial {
  id: string | number;
  quote: string;
  name: string;
  course: string;
  image: string;
}

interface StudentTestimonialsSectionProps {
  className?: string;
}

// Custom hook for responsive breakpoints
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else setScreenSize('lg');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Testimonials data - same as before
const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "I am grateful to SkillsLMS for helping me transition into the role of a Web Developer Internship at CodeSoft. The course curriculum was well-structured and aligned perfectly wit...",
    name: "Devesh Kumar Meena",
    course: "Web Developer, Codesoft",
    image: "https://res.cloudinary.com/dnknslaku/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1758721761/lms_instructor/student_TESTIMONIAL/Gemini_Generated_Image_bi2yztbi2yztbi2y-removebg-preview_rsizlm.png"
  },
  {
    id: 3,
    quote: "SkillsLMS completely transformed my understanding of data science. The practical projects and expert mentorship helped me secure a position as a Data Scientist at a leading company...",
    name: "Apoorva Sharma",
    course: "Data Scientist, TCS",
    image: "https://res.cloudinary.com/dnknslaku/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1758722171/lms_instructor/student_TESTIMONIAL/Gemini_Generated_Image_2j69g32j69g32j69-removebg-preview_qpcuwx.png"
  },
  {
    id: 5,
    quote: "The Full Stack Development course at SkillsLMS was exactly what I needed to transition into tech. The hands-on projects and mentorship were outstanding...",
    name: "Priya Singh",
    course: "Full Stack Developer, Infosys",
    image: "https://res.cloudinary.com/dnknslaku/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1758722369/lms_instructor/student_TESTIMONIAL/Gemini_Generated_Image_rr81d7rr81d7rr81-removebg-preview_ifnimt.png"
  },
  {
    id: 4,
    quote: "From zero programming knowledge to landing my first job as a Software Engineer. SkillsLMS made this incredible journey possible with their structured learning approach...",
    name: "Amit Kumar",
    course: "Software Engineer, Wipro",
    image: "https://res.cloudinary.com/dnknslaku/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1758722417/lms_instructor/student_TESTIMONIAL/Gemini_Generated_Image_lr4vmalr4vmalr4v__1_-removebg-preview_fax5lb.png"
  },
  {
    id: 2,
    quote: "The training I received at SkillsLMS proved instrumental for my role as a Technical Analyst at Mindtree. The comprehensive curriculum and hands-on approach were exactly what I needed...",
    name: "Pallavee Maurya",
    course: "Technical Analyst, Mindtree",
    image: "https://res.cloudinary.com/dnknslaku/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1758721938/lms_instructor/student_TESTIMONIAL/Gemini_Generated_Image_7hkaal7hkaal7hka-removebg-preview_cyijpj.png"
  }
];

const StudentTestimonialsSection: React.FC<StudentTestimonialsSectionProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const screenSize = useResponsive();
  
  const parallaxX = useTransform(x, [-100, 100], [-10, 10]); // Reduced parallax for mobile

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = screenSize === 'sm' ? 30 : 50; // Lower threshold for mobile
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
  };

  // Responsive positioning calculations
  const getCardStyle = (index: number) => {
    const totalCards = testimonials.length;
    let position = (index - currentIndex + totalCards) % totalCards;
    
    if (position > totalCards / 2) {
      position = position - totalCards;
    }
    
    // Responsive card widths and gaps
    const cardConfig = {
      sm: { width: 280, gap: 20 }, // Mobile: smaller cards, tight spacing
      md: { width: 320, gap: 40 }, // Tablet: medium cards
      lg: { width: 416, gap: 60 }  // Desktop: original size
    };
    
    const config = cardConfig[screenSize as keyof typeof cardConfig];
    const { width: cardWidth, gap: gapBetweenCards } = config;
    
    // Mobile: Show only center card
    if (screenSize === 'sm') {
      if (position === 0) {
        return {
          scale: 1.1,
          y: -20,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 15,
          x: 0,
          visible: true
        };
      } else {
        return {
          scale: 0.7,
          y: 40,
          filter: 'blur(4px)',
          opacity: 0,
          zIndex: 1,
          x: position > 0 ? 400 : -400,
          visible: false
        };
      }
    }
    
    // Tablet and Desktop: Show 3 cards
    if (position === 0) {
      return {
        scale: screenSize === 'md' ? 1.15 : 1.2,
        y: screenSize === 'md' ? -25 : -30,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 15,
        x: 0,
        visible: true
      };
    } else if (position === -1) {
      return {
        scale: screenSize === 'md' ? 0.85 : 0.9,
        y: screenSize === 'md' ? 15 : 20,
        filter: 'blur(1px)',
        opacity: screenSize === 'md' ? 0.7 : 0.8,
        zIndex: 10,
        x: -(cardWidth/2 + gapBetweenCards + cardWidth/2),
        visible: true
      };
    } else if (position === 1) {
      return {
        scale: screenSize === 'md' ? 0.85 : 0.9,
        y: screenSize === 'md' ? 15 : 20,
        filter: 'blur(1px)',
        opacity: screenSize === 'md' ? 0.7 : 0.8,
        zIndex: 10,
        x: (cardWidth/2 + gapBetweenCards + cardWidth/2),
        visible: true
      };
    } else {
      return {
        scale: 0.6,
        y: 60,
        filter: 'blur(8px)',
        opacity: 0,
        zIndex: 1,
        x: position > 0 ? 800 : -800,
        visible: false
      };
    }
  };

  return (
    <section id='students' className={cn(
      "relative w-full bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden",
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Headers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-3 sm:mb-4 mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium my-2 sm:my-4">
            <span>🌟</span>
            Hear from our students
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 px-4">
            Hear from our students
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            We help students upskill & grow their career in the most comprehensive way possible.
          </p>
        </motion.div>

        {/* Responsive Cards Section */}
        <motion.div
          ref={constraintsRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative h-[300px] sm:h-[380px] md:h-[420px] lg:h-[480px] flex items-center justify-center px-2 sm:px-4 lg:px-8"
        >
          {/* Draggable Cards Container */}
          <motion.div
            className="relative flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing touch-pan-x"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={screenSize === 'sm' ? 0.05 : 0.1}
            onDragEnd={handleDragEnd}
            style={{ x: parallaxX }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            {testimonials.map((testimonial, index) => {
              const cardStyle = getCardStyle(index);

              if (!cardStyle.visible) return null;

              return (
                <motion.div
                  key={testimonial.id}
                  className={cn(
                    "absolute bg-white rounded-2xl shadow-2xl border border-gray-100 pointer-events-none overflow-hidden",
                    // Responsive card widths
                    "w-[17.5rem] sm:w-[20rem] md:w-[22rem] lg:w-[26rem]"
                  )}
                  animate={{
                    scale: cardStyle.scale,
                    y: cardStyle.y,
                    filter: cardStyle.filter,
                    opacity: cardStyle.opacity,
                    x: cardStyle.x,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: screenSize === 'sm' ? 300 : 260,
                    damping: screenSize === 'sm' ? 30 : 25,
                    duration: screenSize === 'sm' ? 0.6 : 0.8
                  }}
                  style={{ zIndex: cardStyle.zIndex }}
                >
                  <div className="p-3 sm:p-4 lg:p-6 pt-3 sm:pt-4">
                    {/* Responsive Quote */}
                    <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 lg:mb-8 h-16 sm:h-20 lg:h-26 overflow-hidden mt-1 sm:mt-2">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Responsive User Info Row */}
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      {/* Responsive Profile Image */}
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const size = screenSize === 'sm' ? '40' : screenSize === 'md' ? '48' : '56';
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3b82f6&color=fff&size=${size}`;
                        }}
                      />
                      
                      {/* Responsive Name and Course */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 font-semibold text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1 truncate">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                          {testimonial.course}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center card highlight effect */}
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Responsive Navigation Arrows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 mt-[-1rem]"
        >
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Responsive Dot Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentIndex 
                  ? 'bg-blue-600 w-6 sm:w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </motion.div>

        {/* Responsive Success Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Want to get your success stories featured here?
          </p>
        </motion.div>

        {/* Responsive Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-base sm:text-lg rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg touch-manipulation"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentTestimonialsSection;
