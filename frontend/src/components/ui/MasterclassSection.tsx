"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaFigma, FaPython, FaSalesforce, FaReact } from 'react-icons/fa';

interface FloatingIconProps {
  IconComponent: React.ElementType;
  className?: string;
  delay?: number;
  duration?: number;
}

const arrow = 'https://res.cloudinary.com/dnknslaku/image/upload/v1754199718/arrow_snfh2n.gif';

const FloatingIcon: React.FC<FloatingIconProps> = ({ IconComponent, className, delay = 0, duration = 3 }) => {
  return (
    <motion.div
      className={`absolute w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.5, duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: delay,
        }}
      >
        <IconComponent className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700" />
      </motion.div>
    </motion.div>
  );
};

// Main MasterclassSection Component
const MasterclassSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const personImage = "https://pwskills.com/images/masterClass/masterclass_human_web.webp";
  
  // Responsive positioning for tech icons
  const techIcons = [
    { 
      Icon: FaFigma, 
      className: 'top-[8%] left-[12%] sm:top-[10%] sm:left-[15%] md:top-[12%] md:left-[18%] lg:top-[15%] lg:left-[20%]', 
      delay: 0.1, 
      duration: 3.5 
    },
    { 
      Icon: FaPython, 
      className: 'top-[35%] right-[6%] sm:top-[38%] sm:right-[8%] md:top-[42%] md:right-[10%] lg:top-[45%] lg:right-[10%]', 
      delay: 0.3, 
      duration: 4 
    },
    { 
      Icon: FaSalesforce, 
      className: 'top-[6%] right-[20%] sm:top-[8%] sm:right-[25%] md:top-[10%] md:right-[28%] lg:top-[10%] lg:right-[30%]', 
      delay: 0.5, 
      duration: 3 
    },
    { 
      Icon: FaReact, 
      className: 'bottom-[10%] left-[20%] sm:bottom-[12%] sm:left-[25%] md:bottom-[15%] md:left-[28%] lg:bottom-[15%] lg:left-[30%]', 
      delay: 0.2, 
      duration: 4.5 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-gray-50 mb-0 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 sm:gap-16 lg:gap-20">
          
          {/* Left Column: Image and Animations - Fixed Centering */}
          <div className="relative flex items-center justify-center h-[320px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[520px] order-2 lg:order-1 mx-auto w-full">
            
            {/* Enhanced Animated Concentric Circles - Bigger & More Visible */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center w-full h-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] max-h-[320px] sm:max-h-[360px] md:max-h-[420px] lg:max-h-[480px] xl:max-h-[520px] mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            >
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 520 520" 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Outermost Circle - Biggest & Most Visible */}
                <circle 
                  cx="260" 
                  cy="260" 
                  r="250" 
                  fill="none" 
                  stroke="#FECACA" 
                  strokeWidth="3" 
                  strokeDasharray="10 15" 
                  opacity="0.75" 
                  strokeLinecap="round"
                />
                {/* Middle Circle */}
                <circle 
                  cx="260" 
                  cy="260" 
                  r="200" 
                  fill="none" 
                  stroke="#FECACA" 
                  strokeWidth="3" 
                  strokeDasharray="10 15" 
                  opacity="0.8" 
                  strokeLinecap="round"
                />
                {/* Inner Circle */}
                <circle 
                  cx="260" 
                  cy="260" 
                  r="150" 
                  fill="none" 
                  stroke="#FECACA" 
                  strokeWidth="3" 
                  strokeDasharray="10 15" 
                  opacity="0.85" 
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Floating Tech Icons - Enhanced Positioning */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full max-w-[300px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[460px] xl:max-w-[500px] max-h-[300px] sm:max-h-[340px] md:max-h-[400px] lg:max-h-[460px] xl:max-h-[500px] mx-auto">
              {isInView && techIcons.map((icon, index) => (
                <FloatingIcon
                  key={index}
                  IconComponent={icon.Icon}
                  className={icon.className}
                  delay={icon.delay}
                  duration={icon.duration}
                />
              ))}
            </div>

            {/* Main Person Image - Perfect Centering */}
            <motion.div
              className="relative z-10 flex items-center justify-center w-[180px] h-[220px] sm:w-[200px] sm:h-[250px] md:w-[240px] md:h-[300px] lg:w-[280px] lg:h-[350px] xl:w-[320px] xl:h-[400px] mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <img 
                src={personImage} 
                alt="Masterclass instructor" 
                className="w-full h-full object-contain mx-auto"
                style={{ 
                  display: 'block',
                  margin: '0 auto'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
                }}
              />
            </motion.div>
          </div>

          {/* Right Column: Text Content - Fully Responsive & Centered on Small Screens */}
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left order-1 lg:order-2 px-4 sm:px-6 md:px-8 lg:px-0"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Brand Logo - Responsive & Centered */}
            <motion.div 
              variants={itemVariants} 
              className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6 w-full lg:w-auto"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">SK</span>
              </div>
              <span className="font-semibold text-sm sm:text-base md:text-lg text-black">SK SKILLS</span>
              <span className="text-gray-500 text-xs sm:text-sm md:text-base">brings you</span>
            </motion.div>
            
            {/* Main Heading - Responsive & Centered */}
            <motion.h2 
              variants={itemVariants} 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mt-2 mb-4 sm:mb-6 md:mb-8 leading-tight"
            >
              Masterclass
            </motion.h2>

            {/* Description - Responsive & Centered */}
            <motion.p 
              variants={itemVariants} 
              className="text-gray-600 max-w-full sm:max-w-lg md:max-w-xl lg:max-w-md text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed"
            >
              Stuck in your career? Learn & grow with our masterclass led by industry professionals. Learn skills that can make a difference.
            </motion.p>
            
            {/* Button with Arrow - Responsive & Centered */}
            <motion.div className="relative w-full sm:w-auto flex flex-col items-center lg:items-start" variants={itemVariants}>
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0px 15px 30px rgba(255, 107, 74, 0.4)" 
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[#ff6b4a] text-white font-bold rounded-lg shadow-lg hover:bg-[#ff5533] transition-all duration-300 relative z-20 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-sm sm:text-base md:text-lg">Explore Masterclass</span>
                  <motion.svg
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </span>
              </motion.button>  
              
              {/* Responsive Arrow GIF - Centered below button on mobile */}
              <motion.div 
                className="flex justify-center items-center bg-transparent mt-4 sm:mt-6 lg:mt-0 lg:absolute lg:-bottom-16 lg:-left-8 xl:-bottom-20 xl:-left-12"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  duration: 0.6,
                  delay: 1.5
                }}
              >
                <motion.img
                  src={arrow}
                  alt="Pointing arrow to button"
                  loading="lazy"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 transform scale-x-[-1] object-contain"
                  style={{
                    background: 'transparent',
                  }}
                  whileHover={{
                    scale: 1.1,
                    filter: 'brightness(1.1)',
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Arrow image failed to load:', arrow);
                    target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Arrow image loaded successfully');
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassSection;
