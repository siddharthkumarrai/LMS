"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// TypeScript interface for tab data structure
interface Tab {
  id: number;
  title: string;
  description: string;
  icon: string;
  contentUrl: string;
  isVideo: boolean;
}

// 3 tabs data array
const tabs: Tab[] = [
  {
    id: 1,
    title: "Personalized Learning",
    description: "Discover a personalized path with hands-on practical projects.",
    icon: "🎯",
    contentUrl: "https://cdn.pwskills.com/static/home/PERSONALISED_DASHBOARD.mp4",
    isVideo: true
  },
  {
    id: 2,
    title: "Career Assistance",
    description: "Land the Role You Deserve with expert career guidance and mentorship.",
    icon: "🚀",
    contentUrl: "https://cdn.pwskills.com/static/home/CAREER_ASSISTANCE_Final.mp4",
    isVideo: true
  },
  {
    id: 3,
    title: "Interactive Sessions",
    description: "Two-Way Learning for Career-Ready Skills with live interaction.",
    icon: "💬",
    contentUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    isVideo: false
  }
];

// Animation variants for smooth content transitions
const contentVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Tab button animation variants
const tabVariants = {
  inactive: {
    scale: 1,
    x: 0
  },
  active: {
    scale: 1.02,
    x: 4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Description animation variants - Desktop only
const descriptionVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    marginTop: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  },
  visible: {
    height: "auto",
    opacity: 1,
    marginTop: 8,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const InteractiveLearningSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    if (index !== activeTab) {
      setActiveTab(index);
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-gray-50 to-white py-8 md:py-20 overflow-hidden">

      {/* Light Wavy Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-[0.095]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="wavyGrid"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,30 Q15,10 30,30 T60,30"
                stroke="#ff6b6b"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M30,0 Q40,15 30,30 T30,60"
                stroke="#ff6b6b"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="30" cy="30" r="1" fill="#ff6b6b" opacity="0.3" />
            </pattern>
            <pattern
              id="wavyGridDiagonal"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,0 Q20,10 40,0 M0,20 Q20,30 40,20 M0,40 Q20,30 40,40"
                stroke="#ff8a80"
                strokeWidth="0.5"
                fill="none"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wavyGrid)" />
          <rect width="100%" height="100%" fill="url(#wavyGridDiagonal)" />
        </svg>
      </div>

      {/* Section padding maintained */}
      <div className="relative container mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🌟</span>
            Explore Our Courses
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Interactive Learning Experience
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Experience immersive, hands-on learning that empowers you with skills that get you job-ready.
          </p>
        </motion.div>

        {/* Main Layout - Responsive Order Change */}
        <div className="max-w-5xl mx-auto">
          
          {/* MOBILE LAYOUT - Tabs on top, Content below */}
          <div className="lg:hidden">
            
            {/* Mobile Tabs - Top Position */}
            <div className="mb-6">
              <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      ${activeTab === index
                        ? 'bg-white shadow-lg border-2 border-blue-600 text-blue-700'
                        : 'bg-white/70 hover:bg-white hover:shadow-md text-gray-700 border-2 border-transparent'
                      }
                    `}
                  >
                    {/* Mobile Tab Icon */}
                    <div className={`
                      text-lg p-1.5 rounded-lg transition-colors duration-300 flex-shrink-0
                      ${activeTab === index ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      {tab.icon}
                    </div>
                    
                    {/* Mobile Tab Title - NO Description */}
                    <h3 className={`
                      font-semibold text-sm whitespace-nowrap transition-colors duration-300
                      ${activeTab === index ? 'text-blue-900' : 'text-gray-900'}
                    `}>
                      {tab.title}
                    </h3>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mobile Content - Below Tabs */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden h-64 sm:h-80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mobile-content-${activeTab}`}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Mobile Video/Image Content */}
                  {tabs[activeTab].isVideo ? (
                    <video
                      src={tabs[activeTab].contentUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Video failed to load:', e);
                      }}
                    />
                  ) : (
                    <img
                      src={tabs[activeTab].contentUrl}
                      alt={tabs[activeTab].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tabs[activeTab].title)}&background=3b82f6&color=fff&size=800x400&format=png`;
                      }}
                    />
                  )}

                  {/* Mobile Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h4 className="text-white font-bold text-lg mb-2">
                      {tabs[activeTab].title}
                    </h4>
                    <p className="text-white/90 text-sm">
                      {tabs[activeTab].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DESKTOP LAYOUT - Side by Side (Original Layout) */}
          <div className="hidden lg:flex h-[330px]">
            
            {/* Desktop Left Column - 3 Tabs with Descriptions */}
            <div className="w-2/5 p-8 flex flex-col justify-center">
              <div className="space-y-6">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(index)}
                    variants={tabVariants}
                    animate={activeTab === index ? "active" : "inactive"}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full text-left p-5 rounded-xl transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      ${activeTab === index
                        ? 'bg-white shadow-lg border-l-4 border-blue-600 text-blue-700'
                        : 'bg-white/50 hover:bg-white hover:shadow-md text-gray-700 border-l-4 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Desktop Tab Icon */}
                      <div className={`
                        text-xl p-2 rounded-lg transition-colors duration-300 flex-shrink-0
                        ${activeTab === index ? 'bg-blue-100' : 'bg-gray-100'}
                      `}>
                        {tab.icon}
                      </div>

                      {/* Desktop Tab Content */}
                      <div className="flex-1 min-w-0">
                        {/* Desktop Title - Always Visible */}
                        <h3 className={`
                          font-semibold text-base transition-colors duration-300
                          ${activeTab === index ? 'text-blue-900' : 'text-gray-900'}
                        `}>
                          {tab.title}
                        </h3>

                        {/* Desktop Animated Description - Only visible when active */}
                        <motion.div
                          className="overflow-hidden"
                          variants={descriptionVariants}
                          initial="hidden"
                          animate={activeTab === index ? "visible" : "hidden"}
                        >
                          <p className={`
                            text-xs leading-relaxed transition-colors duration-300
                            ${activeTab === index ? 'text-blue-600' : 'text-gray-600'}
                          `}>
                            {tab.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Desktop Right Column - Video/Content Area */}
            <div className="w-3/5 relative bg-gradient-to-br from-blue-50 to-purple-50 self-stretch">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desktop-content-${activeTab}`}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Desktop Video/Image Content */}
                  {tabs[activeTab].isVideo ? (
                    <video
                      src={tabs[activeTab].contentUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Video failed to load:', e);
                      }}
                    />
                  ) : (
                    <img
                      src={tabs[activeTab].contentUrl}
                      alt={tabs[activeTab].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tabs[activeTab].title)}&background=3b82f6&color=fff&size=800x400&format=png`;
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Desktop Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/30 rounded-full blur-lg" />
            </div>
          </div>
        </div>

        {/* Mobile Dot Indicators - Only for mobile */}
        <div className="flex justify-center mt-6 lg:hidden">
          <div className="flex gap-2">
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${activeTab === index ? 'bg-blue-600 w-6' : 'bg-gray-300'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for mobile scroll */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default InteractiveLearningSection;
