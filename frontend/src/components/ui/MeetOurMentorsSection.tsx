"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BsBriefcase, BsPeople } from 'react-icons/bs';

const cn = (...classes: string[]) => twMerge(clsx(...classes));

// Type definitions for mentor data
interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  workExperience: string;
  teachingExperience: string;
  image: string;
  description: string;
  bgColor: string;
  companyLogo: string;
}

// Mentors data array - Based on PW Skills real mentors
const mentors: Mentor[] = [
  {
    id: 1,
    name: "Priyash Nigam",
    role: "CEO, Execute Digital | Fractional CMO",
    company: "Skills",
    workExperience: "9+ Years",
    teachingExperience: "5+ Years",
    image: "https://cdn.pwskills.com/user/profile_pictures/e22ee22b-5734-4b63-b0a4-24f385f2ca83.png",
    description: "Priyash Nigam is a digital marketing strategist with over 9 years of experience in performance marketing and brand building.",
    bgColor: "bg-pink-100",
    companyLogo: "/skills-logo.png"
  },
  {
    id: 2,
    name: "Priya Bhatia",
    role: "Senior Data Scientist",
    company: "Physics Wallah",
    workExperience: "4+ Years",
    teachingExperience: "4+ Years",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    description: "AI ML tech | IIT Hyderabad | Data Structures | Problem Solving | Programming Languages.",
    bgColor: "bg-blue-100",
    companyLogo: "/physics-wallah-logo.png"
  },
  {
    id: 3,
    name: "Sanket Singh",
    role: "Full Stack Developer",
    company: "Google",
    workExperience: "4+ Years",
    teachingExperience: "7+ Years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    description: "Google Pay | Ex-LinkedIn Eng | CS6C Harvard | 7yrs teaching experience with hands-on projects.",
    bgColor: "bg-green-100",
    companyLogo: "/google-logo.png"
  },
  {
    id: 4,
    name: "Ekta Negi",
    role: "Assistant Professor",
    company: "Physics Wallah",
    workExperience: "5+ Years",
    teachingExperience: "5+ Years",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    description: "A passionate doctor-turned-educator has a teaching experience of 7+ years, having taught over 10,000 students.",
    bgColor: "bg-purple-100",
    companyLogo: "/physics-wallah-logo.png"
  },
  {
    id: 5,
    name: "Ajay Kumar Gupta",
    role: "Senior Software Engineer",
    company: "Microsoft",
    workExperience: "6+ Years",
    teachingExperience: "4+ Years",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    description: "Microsoft Azure specialist with extensive experience in cloud computing and software architecture.",
    bgColor: "bg-yellow-100",
    companyLogo: "/microsoft-logo.png"
  },
  {
    id: 6,
    name: "Anuttam Grandhi",
    role: "Data Science Lead",
    company: "Amazon",
    workExperience: "8+ Years",
    teachingExperience: "6+ Years",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    description: "Leading data science initiatives at Amazon with focus on machine learning and AI solutions.",
    bgColor: "bg-indigo-100",
    companyLogo: "/amazon-logo.png"
  }
];

const MeetOurMentorsSection = ({ className }: { className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState('lg');
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect screen size for responsive scroll calculations
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle responsive scroll navigation
  const scrollTo = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      // Responsive scroll amounts based on screen size
      const scrollConfig = {
        sm: { cardWidth: 290, visibleCards: 1 }, // Mobile: 1 card visible
        md: { cardWidth: 330, visibleCards: 1.5 }, // Tablet: 1.5 cards visible
        lg: { cardWidth: 340, visibleCards: 2 }, // Small desktop: 2 cards visible
        xl: { cardWidth: 365, visibleCards: 3 } // Large desktop: 3 cards visible
      };

      const config = scrollConfig[screenSize as keyof typeof scrollConfig];
      const scrollAmount = config.cardWidth;

      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setCurrentIndex(Math.max(0, currentIndex - 1));
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setCurrentIndex(Math.min(mentors.length - 1, currentIndex + 1));
      }
    }
  };

  // Calculate max scroll index based on screen size
  const getMaxScrollIndex = () => {
    const visibleCardsConfig = {
      sm: 1,
      md: 1.5,
      lg: 2,
      xl: 3
    };
    
    const visibleCards = visibleCardsConfig[screenSize as keyof typeof visibleCardsConfig];
    return Math.max(0, mentors.length - Math.floor(visibleCards));
  };

  return (
    <section className={cn(
      "relative w-full bg-gradient-to-b from-gray-50 to-white py-16",
    )}>

      {/* Light Wavy Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-[0.092]"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="mentorGrid"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="25" cy="25" r="1" fill="#3b82f6" opacity="0.3" />
              <path
                d="M0,25 Q12.5,10 25,25 T50,25"
                stroke="#3b82f6"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mentorGrid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-0">
          
          {/* Left Side - Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-8 mt-20">
              <span>👨‍🏫</span>
              Game Changers
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 -mb-0">
              Meet our Mentors
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </motion.div>
        </div>

        {/* Navigation Arrows - Responsive Logic */}
        <div className="z-10 flex gap-3 justify-end mb-6">
          <button
            onClick={() => scrollTo('left')}
            disabled={currentIndex === 0}
            className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => scrollTo('right')}
            disabled={currentIndex >= getMaxScrollIndex()}
            className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mentors Cards Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Responsive Scrollable Cards Container */}
          <div
            ref={containerRef}
            className={cn(
              "flex overflow-x-auto pb-4 scrollbar-hide",
              // Responsive gap and padding
              "gap-4 sm:gap-6 lg:gap-10",
              "px-2 sm:px-4 lg:px-6"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group",
                  // Responsive card widths
                  "w-72 sm:w-80 lg:w-80 xl:w-80"
                )}
              >
                {/* Mentor Image Section WITH ELEGANT TEXT BACKGROUND */}
                <div className={`relative h-48 ${mentor.bgColor} p-0 flex items-end justify-end overflow-hidden`}>
                  
                  {/* Elegant Text Background Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Main decorative text - MENTOR */}
                    <div className="absolute bottom-1 left-1 transform -rotate-0">
                      <span className="text-[14rem] font-bold text-white/29 select-none">
                        Ki
                      </span>
                    </div>
                    
                    {/* Secondary decorative text - EXPERT */}
                    <div className="absolute top-8 right-2 transform rotate-6">
                      <span className="text-4xl font-light text-white/28 select-none">
                        EXPERT
                      </span>
                    </div>
                    
                    {/* Tertiary decorative text - GUIDE */}
                    <div className="absolute bottom-0 left-2 transform -rotate-6">
                      <span className="text-[4rem] font-medium text-white/28 select-none">
                        GUIDE
                      </span>
                    </div>
                    
                    {/* Additional elegant text - LEADER */}
                    <div className="absolute bottom-8 right-4 transform rotate-12">
                      <span className="text-2xl font-semibold text-white/7 select-none">
                        LEADER
                      </span>
                    </div>

                    {/* Decorative dots and lines */}
                    <div className="absolute top-6 right-8">
                      <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="absolute top-12 right-6">
                      <div className="w-0.5 h-0.5 bg-white/15 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-12 left-6">
                      <div className="w-1.5 h-1.5 bg-white/25 rounded-full"></div>
                    </div>
                    
                    {/* Subtle geometric lines */}
                    <div className="absolute top-16 left-8 w-8 h-px bg-white/10 transform rotate-45"></div>
                    <div className="absolute bottom-16 right-8 w-6 h-px bg-white/15 transform -rotate-45"></div>
                  </div>

                  {/* Mentor Image */}
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-44 h-44 object-cover relative z-10"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=3b82f6&color=fff&size=96`;
                    }}
                  />
                </div>

                {/* Mentor Details Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{mentor.role}</p>

                    {/* Company Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {mentor.company.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{mentor.company}</span>
                    </div>
                  </div>

                  {/* Experience Section - Responsive Layout */}
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-700">

                    {/* Work Experience */}
                    <div className="flex items-center gap-2">
                      <BsBriefcase className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">{mentor.workExperience}</p>
                        <p className="text-xs text-gray-500">Work Experience</p>
                      </div>
                    </div>

                    {/* Teaching Experience */}
                    <div className="flex items-center gap-2">
                      <BsPeople className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">{mentor.teachingExperience}</p>
                        <p className="text-xs text-gray-500">Teaching Experience</p>
                      </div>
                    </div>

                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mt-4 line-clamp-3">
                    {mentor.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Dots Indicator - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 gap-2"
        >
          {Array.from({ length: Math.ceil(mentors.length / (screenSize === 'sm' ? 1 : screenSize === 'md' ? 1 : screenSize === 'lg' ? 2 : 3)) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * (screenSize === 'sm' ? 1 : screenSize === 'md' ? 1 : screenSize === 'lg' ? 2 : 3))}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / (screenSize === 'sm' ? 1 : screenSize === 'md' ? 1 : screenSize === 'lg' ? 2 : 3)) === index
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
      {/* Section padding maintained */}
      <div className="relative container mx-auto px-4 lg:px-8 py-12"></div>
    </section>
  );
};

export default MeetOurMentorsSection;
