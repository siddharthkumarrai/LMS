"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Type definitions
interface ScrollItem {
  id: string | number;
  name: string;
  jobTitle: string;
  courseDescription: string; // Normal text course (e.g., "Full Stack Development with AI")
  categoryTag: string; // Bottom colored tag (e.g., "Software Development Courses")
  image: string;
  companyName: string;
  companyLogo?: string;
}

interface InfiniteScrollerProps {
  items: ScrollItem[];
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

const cn = (...classes: string[]) => twMerge(clsx(...classes));

const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({
  items,
  speed = 'normal',
  direction = 'right',
  pauseOnHover = true,
  className,
}) => {
  const speedConfig = {
    slow: 60,
    normal: 40,
    fast: 20,
  };

  const duration = speedConfig[speed];
  const estimatedCardWidth = 200;
  const animationDistance = items.length * estimatedCardWidth;

  const animationVariants:any = {
    animate: {
      x: direction === 'right' ? [-animationDistance, 0] : [0, -animationDistance],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: duration,
          ease: "linear",
        },
      },
    },
  };

  // Card component with 5 rows (including 2 course mentions)
  const Card: React.FC<{ item: ScrollItem }> = ({ item }) => {
    
    const getCompanyLogo = (companyName: string) => {
      const logoMap: Record<string, string> = {
        'wipro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png',
        'SWIGGY': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/200px-Swiggy_logo.svg.png',
        'TCS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png',
        'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png',
        'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png'
      };
      return logoMap[companyName] || item.companyLogo;
    };

    // Get category color based on category type
    const getCategoryColor = (category: string) => {
      const colorMap: Record<string, string> = {
        'Software Development Courses': 'from-blue-600 to-blue-700',
        'Data Science & Analytics': 'from-purple-600 to-purple-700',
        'Digital Marketing With AI': 'from-yellow-500 to-orange-600',
        'Cybersecurity Courses': 'from-indigo-600 to-indigo-700',
        'Programming Courses': 'from-orange-500 to-red-600',
        'Banking & Finance': 'from-green-600 to-green-700',
        'Product Management with...': 'from-pink-600 to-pink-700'
      };
      return colorMap[category] || 'from-gray-600 to-gray-700';
    };

    return (
      <div className="flex-shrink-0 w-64 h-76 bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border border-slate-700 rounded-xl mx-3 flex flex-col relative overflow-hidden group hover:border-slate-600 transition-all duration-300">
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 p-5 flex-1 flex flex-col">
          
          {/* Row 1: Square Image + Company Name (Same Row) */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=475569&color=fff&size=64&format=png`;
                  }}
                />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-0.5">
                  {getCompanyLogo(item.companyName) ? (
                    <img 
                      src={getCompanyLogo(item.companyName)} 
                      alt={item.companyName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs font-bold text-slate-800">${item.companyName.charAt(0)}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-800">
                      {item.companyName.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-white text-sm font-medium">
                  {item.companyName}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Person's Name */}
          <div className="mb-3">
            <h3 className="text-white font-bold text-xl leading-tight">
              {item.name}
            </h3>
          </div>

          {/* Row 3: Job Title */}
          <div className="mb-3">
            <p className="text-slate-300 text-base font-medium">
              {item.jobTitle}
            </p>
          </div>

          {/* Row 4: Course Description (First Course Mention - Normal Text) */}
          <div className="mb-4">
            <p className="text-slate-200 text-sm leading-relaxed">
              {item.courseDescription}
            </p>
          </div>
        </div>

        {/* Row 5: Course Category Tag (Second Course Mention - Bottom Border) */}
        <div className="relative z-10 border-t border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-4">
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${getCategoryColor(item.categoryTag)} text-white text-xs font-semibold rounded-full shadow-lg`}>
              <span className="mr-2">📚</span>
              <span className="truncate">
                {item.categoryTag}
              </span>
            </span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute inset-0 rounded-xl shadow-inner shadow-black/20 pointer-events-none" />
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden py-8",
        "before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-40",
        "before:bg-gradient-to-r before:from-black before:via-black/30 before:to-transparent",
        "before:content-[''] before:pointer-events-none",
        "after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-40",
        "after:bg-gradient-to-l after:from-black after:via-black/30 after:to-transparent", 
        "after:content-[''] after:pointer-events-none",
      )}
    >
      <motion.div
        className="flex items-center"
        variants={animationVariants}
        animate="animate"
        whileHover={pauseOnHover ? { x: undefined } : undefined}
        style={{
          x: direction === 'left' ? -animationDistance : 0,
        }}
      >
        {items.map((item, index) => (
          <Card key={`first-${item.id}-${index}`} item={item} />
        ))}
        {items.map((item, index) => (
          <Card key={`second-${item.id}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScroller;
