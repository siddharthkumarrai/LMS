"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for class name merging
const cn = (...classes: string[]) => twMerge(clsx(...classes));

// Type definitions
interface StatItem {
  id: string | number;
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

interface CompanyLogo {
  id: string | number;
  name: string;
  logo: string;
  website?: string;
}

interface StatsAndLogosProps {
  stats?: StatItem[];
  companies?: CompanyLogo[];
  className?: string;
}

// Reusable CountingNumber component with viewport animation
const CountingNumber: React.FC<{
  value: number;
  suffix?: string;
  duration?: number;
}> = ({ value, suffix = "", duration = 2 }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { 
    once: true,
    margin: "0px 0px -100px 0px"
  });
  
  useEffect(() => {
    if (!isInView) return;
    
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = Math.round(latest).toString() + suffix;
      },
    });

    return () => controls.stop();
  }, [isInView, value, suffix, duration]);

  return (
    <span 
      ref={nodeRef}
      className="text-4xl md:text-5xl font-bold text-white"
    >
      0{suffix}
    </span>
  );
};

// Default stats data matching the screenshot
const defaultStats: StatItem[] = [
  {
    id: 1,
    value: 600,
    suffix: "+",
    label: "Courses on the Platform",
    duration: 2.5
  },
  {
    id: 2,
    value: 20,
    suffix: "+", 
    label: "Mentors from the Industry",
    duration: 1.8
  },
  {
    id: 3,
    value: 100,
    suffix: "+",
    label: "Students places successfully", 
    duration: 2.2
  },
  {
    id: 4,
    value: 55,
    suffix: "%",
    label: "Average Salary Hike",
    duration: 2.0
  }
];

// Default company logos matching the screenshot
const defaultCompanies: CompanyLogo[] = [
  // Top row
  {
    id: 1,
    name: "IndusInd Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/IndusInd_Bank_logo.svg/200px-IndusInd_Bank_logo.svg.png",
    website: "https://www.indusind.com"
  },
  {
    id: 2,
    name: "Swiggy", 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/200px-Swiggy_logo.svg.png",
    website: "https://www.swiggy.com"
  },
  {
    id: 3,
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png", 
    website: "https://www.tcs.com"
  },
  {
    id: 4,
    name: "Wipro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png",
    website: "https://www.wipro.com"
  },
  {
    id: 5,
    name: "Genpact",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Genpact_logo.svg/200px-Genpact_logo.svg.png",
    website: "https://www.genpact.com"
  },
  {
    id: 6,
    name: "MyIndiamart",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/IndiaMART_Logo.svg/200px-IndiaMART_Logo.svg.png",
    website: "https://www.indiamart.com"
  },
  // Bottom row
  {
    id: 7,
    name: "Axis Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/200px-Axis_Bank_logo.svg.png",
    website: "https://www.axisbank.com"
  },
  {
    id: 8,
    name: "PwC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PwC_Logo.svg/200px-PwC_Logo.svg.png",
    website: "https://www.pwc.com"
  },
  {
    id: 9,
    name: "Cognizant",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cognizant_logo_2022.svg/200px-Cognizant_logo_2022.svg.png",
    website: "https://www.cognizant.com"
  },
  {
    id: 10,
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/200px-Uber_logo_2018.svg.png",
    website: "https://www.uber.com"
  }
];

const StatsAndLogos: React.FC<StatsAndLogosProps> = ({
  stats = defaultStats,
  companies = defaultCompanies,
  className
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { 
    once: true,
    margin: "0px 0px -50px 0px"
  });

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "relative w-full py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black",
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        
        {/* Stats Bar Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 md:mb-20"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative group"
              >
                {/* Glass morphism stat box */}
                <div className="relative p-6 md:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl hover:bg-white/15 transition-all duration-300 text-center">
                  
                  {/* Animated number */}
                  <div className="mb-3">
                    <CountingNumber 
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={stat.duration}
                    />
                  </div>
                  
                  {/* Label */}
                  <p className="text-gray-300 text-sm md:text-base font-medium leading-tight">
                    {stat.label}
                  </p>
                  
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-xl shadow-inner shadow-black/20 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trusted By Companies Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Trusted By Leading Companies
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
          </div>

          {/* Company logos grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8 + (0.1 * index),
                  type: "spring",
                  stiffness: 120
                }}
                className="group cursor-pointer"
              >
                <div className="relative p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300">
                  {company.website ? (
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="h-8 md:h-10 lg:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=374151&color=fff&size=100&format=png`;
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-8 md:h-10 lg:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=374151&color=fff&size=100&format=png`;
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
    </section>
  );
};

export default StatsAndLogos;
