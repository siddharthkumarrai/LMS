import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tags configuration with updated theme colors
const TAGS = [
  // Left side stack (4 tags)
  { id: 1, label: "Data Science & Analytics", color: "bg-gradient-to-r from-purple-600 to-purple-700", slot: "left-1" },
  { id: 2, label: "Digital Marketing With AI", color: "bg-gradient-to-r from-yellow-500 to-orange-600", slot: "left-2" },
  { id: 3, label: "Programming Courses", color: "bg-gradient-to-r from-orange-500 to-red-600", slot: "left-3" },
  { id: 4, label: "Product Management with...", color: "bg-gradient-to-r from-pink-600 to-pink-700", slot: "left-4" },
  // Right side stack (3 tags)
  { id: 5, label: "Software Development...", color: "bg-gradient-to-r from-blue-600 to-blue-700", slot: "right-1" },
  { id: 6, label: "Banking & Finance", color: "bg-gradient-to-r from-green-600 to-green-700", slot: "right-2" },
  { id: 7, label: "Cybersecurity Courses", color: "bg-gradient-to-r from-indigo-600 to-indigo-700", slot: "right-3" },
];

const PWSkillsHeroSection = () => {
  const [showTags, setShowTags] = useState(false);

  // Get tag position based on slot
  const getTagPosition = (slot) => {
    const positions = {
      // Left side - vertical stack
      "left-1": { x: -520, y: -80, rotate: -6 },
      "left-2": { x: -650, y: -20, rotate: 4 },
      "left-3": { x: -590, y: 40, rotate: -3 },
      "left-4": { x: -550, y: 100, rotate: 7 },
      // Right side - vertical stack  
      "right-1": { x: 420, y: -60, rotate: -4 },
      "right-2": { x: 440, y: 0, rotate: 5 },
      "right-3": { x: 460, y: 60, rotate: -6 },
    };
    return positions[slot] || { x: 0, y: 0, rotate: 0 };
  };

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center overflow-hidden">
      
      {/* Updated Grid Background - Matching theme */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #475569 1px, transparent 1px),
            linear-gradient(to bottom, #475569 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Enhanced Grid Line Beams - Theme colors */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Vertical traveling beam - Blue theme */}
        <motion.div
          className="absolute w-0.5 rounded-full pointer-events-none"
          style={{
            height: '60px',
            background: 'linear-gradient(180deg, transparent, #3b82f6, #8b5cf6, transparent)',
            boxShadow: '0 0 20px #3b82f6, 0 0 40px #8b5cf6',
            left: '25%',
          }}
          animate={{
            y: ['0vh', '100vh', '0vh'],
            x: ['0vw', '10vw', '20vw', '30vw', '40vw', '50vw', '60vw', '70vw', '50vw', '30vw', '10vw', '0vw'],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
        />

        {/* Horizontal traveling beam - Purple theme */}
        <motion.div
          className="absolute h-0.5 rounded-full pointer-events-none"
          style={{
            width: '60px',
            background: 'linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent)',
            boxShadow: '0 0 20px #8b5cf6, 0 0 40px #3b82f6',
            top: '35%',
          }}
          animate={{
            x: ['0vw', '100vw', '0vw'],
            y: ['0vh', '5vh', '10vh', '15vh', '20vh', '25vh', '30vh', '20vh', '10vh', '0vh'],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
            delay: 2,
          }}
        />

        {/* Additional diagonal beam - Gradient theme */}
        <motion.div
          className="absolute w-0.5 rounded-full pointer-events-none"
          style={{
            height: '40px',
            background: 'linear-gradient(180deg, transparent, #06b6d4, #8b5cf6, transparent)',
            boxShadow: '0 0 15px #06b6d4, 0 0 30px #8b5cf6',
            right: '30%',
          }}
          animate={{
            y: ['100vh', '0vh', '100vh'],
            x: ['-5vw', '5vw', '15vw', '10vw', '0vw', '-5vw'],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
            delay: 4,
          }}
        />
      </div>

      {/* Updated Radial Gradient Overlay - Theme matched */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(51, 65, 85, 0.3) 0%, rgba(17, 24, 39, 0.7) 60%, rgba(0, 0, 0, 0.9) 100%)'
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 text-center">
        {/* Tags Container */}
        <div className="relative">
          <AnimatePresence>
            {showTags && TAGS.map((tag, index) => {
              const pos = getTagPosition(tag.slot);
              return (
                <motion.div
                  key={tag.id}
                  className={`absolute px-4 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer ${tag.color} border border-white/20 shadow-lg`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center',
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
                    zIndex: 30
                  }}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    x: 0, 
                    y: 0, 
                    rotate: 0 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: pos.x, 
                    y: pos.y, 
                    rotate: pos.rotate 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    x: 0, 
                    y: 0, 
                    rotate: 0 
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.1
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                >
                  {tag.label}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Main Heading - Enhanced */}
          <div
            className="relative z-40 px-8 py-4"
            style={{ cursor: showTags ? 'text' : 'pointer' }}
            onMouseEnter={() => setShowTags(true)}
            onMouseLeave={() => setShowTags(false)}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Learn Skills That Matter
            </motion.h1>

            {/* Subtle glow behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-3xl opacity-30 -z-10" />
          </div>
        </div>

        {/* Subtitle - Enhanced */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Gain real-world, job-ready skills for the future.
        </motion.p>

        {/* CTA Button - Theme matched */}
        <motion.button
          className="mt-8 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg border border-blue-500/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          Get Started →
        </motion.button>
      </div>

      {/* Additional theme elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl animate-pulse delay-1000" />
    </section>
  );
};

export default PWSkillsHeroSection;
