"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TechIcon {
  id: number;
  name: string;
  icon: string;
  position: {
    angle: number;
    radius: number;
  };
}

interface FloatingIconProps {
  icon: TechIcon;
  index: number;
  isVisible: boolean;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, index, isVisible }) => {
  // Convert polar coordinates (angle, radius) to cartesian (x, y)
  const x = Math.cos((icon.position.angle * Math.PI) / 180) * icon.position.radius;
  const y = Math.sin((icon.position.angle * Math.PI) / 180) * icon.position.radius;

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        delay: 0.8 + index * 0.1, // Staggered entrance
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -10, 0], // Gentle up-down floating
          rotate: [0, 2, -2, 0] // Subtle rotation
        }}
        transition={{
          duration: 2.5 + Math.random() * 2, // Random duration for organic feel (2.5-4.5s)
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2 // Staggered floating delays
        }}
      >
        {/* Icon container with white background */}
        <motion.div
          className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-100 p-2.5 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={icon.icon}
            alt={icon.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${icon.name}&background=fb923c&color=fff&size=24`;
            }}
          />
        </motion.div>

        {/* Hover tooltip */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none whitespace-nowrap z-30"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {icon.name}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-800" />
        </motion.div>

        {/* Subtle pulse animation on icon background */}
        <motion.div
          className="absolute inset-0 bg-orange-200 rounded-full -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: index * 0.3 // Staggered pulse effect
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FloatingIcon;
