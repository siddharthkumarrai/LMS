"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// FloatingIcon Component
interface FloatingIconProps {
  icon: string;
  color: string;
  delay: number;
  duration: number;
  position: { top?: string; left?: string; right?: string; bottom?: string };
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, color, delay, duration, position }) => {
  return (
    <motion.div
      className="absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
      style={{ backgroundColor: color, ...position }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -8, 0]
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: delay + 0.5
        }
      }}
    >
      <span className="text-white text-xs font-bold">{icon}</span>
    </motion.div>
  );
};

// Fresh Arrow Component - Points to Button
const AnimatedArrow: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div className="absolute left-0 -bottom-12 lg:-bottom-16">
      <motion.svg
        width="200"
        height="80"
        viewBox="0 0 200 80"
        className="text-[#ff6b4a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
      >
        {/* Main Curly Arrow Path pointing to button */}
        <motion.path
          d="M 20 20 Q 40 5, 60 25 Q 85 45, 110 30 Q 135 15, 160 35 Q 175 45, 165 55 L 160 50"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            pathLength: { 
              duration: 3,
              delay: delay + 0.8,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut"
            },
            opacity: {
              duration: 3,
              delay: delay + 0.8,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut"
            }
          }}
          style={{
            filter: 'drop-shadow(2px 2px 4px rgba(255, 107, 74, 0.3))'
          }}
        />
        
        {/* Arrow Head */}
        <motion.path
          d="M 160 50 L 155 45 M 160 50 L 155 55"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            pathLength: {
              duration: 3,
              delay: delay + 2.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeOut"
            },
            opacity: {
              duration: 3,
              delay: delay + 2.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeOut"
            }
          }}
        />

        {/* Decorative Curl */}
        <motion.path
          d="M 140 65 Q 150 70, 155 75 Q 158 77, 154 78"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.7, 0.7, 0]
          }}
          transition={{ 
            pathLength: {
              duration: 3,
              delay: delay + 3.2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut"
            },
            opacity: {
              duration: 3,
              delay: delay + 3.2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut"
            }
          }}
        />
      </motion.svg>

      {/* Pointing Text */}
      <motion.div
        className="absolute -top-8 left-16 text-sm text-[#ff6b4a] font-semibold whitespace-nowrap bg-white/90 px-3 py-1 rounded-full shadow-lg border border-orange-200"
        initial={{ opacity: 0, y: 15, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: delay + 4,
          duration: 0.8,
          type: "spring",
          stiffness: 200
        }}
      >
        <motion.span
          className="inline-flex items-center gap-1"
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
        >
          <span className="text-lg">👇</span>
          Click here!
        </motion.span>
      </motion.div>
    </div>
  );
};

// Main Fresh MasterclassSection Component
const MasterclassSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section ref={sectionRef} className="min-h-screen bg-gray-50 flex items-center justify-center py-20 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Image with Rotating Circles & Floating Icons */}
          <div className="relative flex justify-center items-center order-2 lg:order-1">
            
            {/* Rotating Concentric Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[1, 2, 3].map((index) => (
                <motion.svg
                  key={index}
                  className="absolute"
                  width={320 + index * 80}
                  height={320 + index * 80}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { 
                    opacity: 0.25 - index * 0.06,
                    rotate: 360 
                  } : {}}
                  transition={{
                    opacity: { duration: 0.8, delay: index * 0.2 },
                    rotate: { 
                      duration: 25 + index * 8,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  <circle
                    cx="50%"
                    cy="50%"
                    r={150 + index * 40}
                    fill="none"
                    stroke="#ff6b4a"
                    strokeWidth="2"
                    strokeDasharray="12 16"
                    strokeLinecap="round"
                  />
                </motion.svg>
              ))}
            </div>

            {/* Floating Tech Icons */}
            <FloatingIcon 
              icon="Fg" 
              color="#1e1e1e" 
              delay={0.4} 
              duration={3.2}
              position={{ top: '12%', left: '18%' }}
            />
            <FloatingIcon 
              icon="Py" 
              color="#3776ab" 
              delay={0.7} 
              duration={3.8}
              position={{ top: '28%', right: '22%' }}
            />
            <FloatingIcon 
              icon="Sf" 
              color="#00a1e0" 
              delay={1.0} 
              duration={4.2}
              position={{ bottom: '32%', right: '12%' }}
            />
            <FloatingIcon 
              icon="Js" 
              color="#f7df1e" 
              delay={1.3} 
              duration={3.5}
              position={{ bottom: '18%', left: '12%' }}
            />
            <FloatingIcon 
              icon="Rt" 
              color="#61dafb" 
              delay={1.6} 
              duration={3.9}
              position={{ top: '45%', left: '8%' }}
            />
            <FloatingIcon 
              icon="Nd" 
              color="#339933" 
              delay={1.9} 
              duration={3.3}
              position={{ top: '35%', right: '8%' }}
            />

            {/* Main Professional Image */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                delay: 0.5
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-orange-100 to-pink-100 p-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Professional Instructor"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ui-avatars.com/api/?name=Instructor&background=ff6b4a&color=fff&size=400";
                  }}
                />
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/15 to-pink-400/15 blur-3xl -z-10" />
            </motion.div>
          </div>

          {/* Right Column - Text Content with Arrow Pointing to Button */}
          <motion.div
            className="space-y-8 relative order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            
            {/* Skills Brand Logo */}
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">SK</span>
              </div>
              <span className="text-black font-bold text-xl">SKILLS</span>
            </motion.div>

            {/* Brings you text */}
            <motion.p variants={itemVariants} className="text-gray-600 text-lg">
              brings you
            </motion.p>

            {/* Masterclass Heading */}
            <motion.div variants={itemVariants} className="relative">
              <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
                Masterclass
              </h1>
            </motion.div>

            {/* Description Text */}
            <motion.p 
              variants={itemVariants} 
              className="text-gray-600 text-xl leading-relaxed max-w-lg"
            >
              Stuck in your career? Learn & grow with our masterclass led by
              industry professionals. Learn skills that can make a difference.
            </motion.p>

            {/* CTA Button with Arrow Pointing to It */}
            <motion.div variants={itemVariants} className="relative pt-6">
              <motion.button 
                className="bg-[#ff6b4a] text-white px-10 py-5 rounded-2xl font-semibold text-xl shadow-xl relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(255, 107, 74, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Hover background effect */}
                <motion.div
                  className="absolute inset-0 bg-[#ff5533]"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Explore Masterclass
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </span>
              </motion.button>

              {/* Arrow pointing to button */}
              <AnimatedArrow delay={2.0} />
            </motion.div>

            {/* Additional Stats */}
            <motion.div 
              variants={itemVariants}
              className="pt-8 space-y-4"
            >
              <p className="text-sm text-gray-500">
                Join 50,000+ students transforming their careers
              </p>
              
              {/* 5-star rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                      transition={{ 
                        delay: 2.5 + i * 0.1, 
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">4.9/5 (15,000+ reviews)</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Floating Chat Widget */}
      <motion.div 
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#ff6b4a] rounded-full flex items-center justify-center shadow-xl cursor-pointer z-50"
        whileHover={{ 
          scale: 1.15,
          boxShadow: "0 8px 25px rgba(255, 107, 74, 0.5)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -4, 0]
        }}
        transition={{
          y: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <svg 
          className="w-7 h-7 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default MasterclassSection;
