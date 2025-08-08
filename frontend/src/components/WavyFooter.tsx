"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaLinkedin, 
  FaYoutube, 
  FaTelegram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

// TypeScript interfaces (same as before)
interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Footer data (same as before)
const companyLinks: FooterLink[] = [
  { name: "About us", href: "/about-us" },
  { name: "Contact us", href: "/contact-us" },
  { name: "FAQ", href: "/faqs" },
  { name: "Blog", href: "/" },
  { name: "Career Services", href: "/" }
];

const categoryLinks: FooterLink[] = [
  { name: "Data Science & Analytics", href: "/" },
  { name: "Software Development Courses", href: "/" },
  { name: "Digital Marketing With AI", href: "/" },
  { name: "Banking & Finance", href: "/" },
  { name: "Programming Courses", href: "/" },
  { name: "Cybersecurity Courses", href: "/" },
  { name: "Product Management with AI", href: "/" }
];

const socialLinks: SocialLink[] = [
  { 
    name: "Linkedin", 
    href: "https://in.linkedin.com/in/siddharthkumarrai", 
    icon: FaLinkedin 
  },
  { 
    name: "Youtube", 
    href: "https://in.linkedin.com/in/siddharthkumarrai", 
    icon: FaYoutube 
  },
  { 
    name: "Telegram", 
    href: "https://in.linkedin.com/in/siddharthkumarrai", 
    icon: FaTelegram 
  }
];

// Animation variants (same as before)
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

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const PWSkillsFooter: React.FC = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  return (
    <footer 
      ref={footerRef}
      className="relative bg-[#171214] font-sans overflow-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* FIXED: Background Wavy Pattern SVG with Proper Positioning */}
      <div 
        className="absolute bottom-0 w-full h-full"
        style={{
          right: 0,
          width: '100vw',
          height: '100%',
          overflow: 'visible',
          zIndex: 1
        }}
      >
        <svg 
          className="absolute bottom-0 right-0"
          style={{ 
            width: '100vw', 
            height: '100%',
            minWidth: '1440px',
            overflow: 'visible'
          }}
          viewBox="0 0 1440 312" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMax meet"
        >
          <g opacity="0.1">
            <path 
              d="M0 6.20479L34.4 3.90977C68.8 1.74977 137.6 -2.84023 206.08 4.58477C274.72 12.0098 342.88 31.4498 411.52 49.1348C480 66.9548 548.8 83.1548 617.28 80.7248C685.92 78.1598 754.08 57.0998 822.72 42.2498C891.2 27.3998 960 18.7598 1028.48 23.0798C1097.12 27.3998 1165.28 44.4098 1233.92 55.7498C1302.4 66.9548 1371.2 72.3548 1405.6 75.0548L1440 77.7548V311.305H1405.6C1371.2 311.305 1302.4 311.305 1233.92 311.305C1165.28 311.305 1097.12 311.305 1028.48 311.305C960 311.305 891.2 311.305 822.72 311.305C754.08 311.305 685.92 311.305 617.28 311.305C548.8 311.305 480 311.305 411.52 311.305C342.88 311.305 274.72 311.305 206.08 311.305C137.6 311.305 68.8 311.305 34.4 311.305H0V6.20479Z" 
              fill="#FA7268"
            />
            <path 
              d="M0 90.1016L34.4 94.3384C68.8 98.4606 137.6 106.934 206.08 109.339C274.72 111.858 342.88 108.423 411.52 104.988C480 101.552 548.8 98.1171 617.28 109.339C685.92 120.675 754.08 146.554 822.72 144.149C891.2 141.63 960 110.713 1028.48 101.323C1097.12 92.0482 1165.28 104.186 1233.92 117.24C1302.4 130.179 1371.2 143.92 1405.6 150.791L1440 157.661V311.102H1405.6C1371.2 311.102 1302.4 311.102 1233.92 311.102C1165.28 311.102 1097.12 311.102 1028.48 311.102C960 311.102 891.2 311.102 822.72 311.102C754.08 311.102 685.92 311.102 617.28 311.102C548.8 311.102 480 311.102 411.52 311.102C342.88 311.102 274.72 311.102 206.08 311.102C137.6 311.102 68.8 311.102 34.4 311.102H0V90.1016Z" 
              fill="#EF5F67"
            />
            <path 
              d="M0 152.065L34.4 150.336C68.8 148.608 137.6 145.15 206.08 149.414C274.72 153.563 342.88 165.549 411.52 167.277C480 169.006 548.8 160.478 617.28 153.563C685.92 146.648 754.08 141.347 822.72 136.853C891.2 132.473 960 129.016 1028.48 133.28C1097.12 137.429 1165.28 149.414 1233.92 148.838C1302.4 148.262 1371.2 135.124 1405.6 128.67L1440 122.102V311.102H1405.6C1371.2 311.102 1302.4 311.102 1233.92 311.102C1165.28 311.102 1097.12 311.102 1028.48 311.102C960 311.102 891.2 311.102 822.72 311.102C754.08 311.102 685.92 311.102 617.28 311.102C548.8 311.102 480 311.102 411.52 311.102C342.88 311.102 274.72 311.102 206.08 311.102C137.6 311.102 68.8 311.102 34.4 311.102H0V152.065Z" 
              fill="#E34C67"
            />
            <path 
              d="M0 199.254L34.4 204.654C68.8 210.054 137.6 220.854 206.08 221.259C274.72 221.799 342.88 211.809 411.52 209.379C480 206.949 548.8 211.809 617.28 209.379C685.92 206.949 754.08 196.959 822.72 187.779C891.2 178.599 960 169.959 1028.48 174.549C1097.12 179.004 1165.28 196.554 1233.92 196.149C1302.4 195.609 1371.2 177.249 1405.6 167.934L1440 158.754V311.304H1405.6C1371.2 311.304 1302.4 311.304 1233.92 311.304C1165.28 311.304 1097.12 311.304 1028.48 311.304C960 311.304 891.2 311.304 822.72 311.304C754.08 311.304 685.92 311.304 617.28 311.304C548.8 311.304 480 311.304 411.52 311.304C342.88 311.304 274.72 311.304 206.08 311.304C137.6 311.304 68.8 311.304 34.4 311.304H0V199.254Z" 
              fill="#D53867"
            />
            <path 
              d="M0 240.102L34.4 245.987C68.8 251.966 137.6 263.737 206.08 264.391C274.72 265.045 342.88 254.395 411.52 249.257C480 244.119 548.8 244.492 617.28 246.361C685.92 248.229 754.08 251.592 822.72 251.966C891.2 252.246 960 249.444 1028.48 247.762C1097.12 245.987 1165.28 245.427 1233.92 248.977C1302.4 252.527 1371.2 260.374 1405.6 264.204L1440 268.128V311.102H1405.6C1371.2 311.102 1302.4 311.102 1233.92 311.102C1165.28 311.102 1097.12 311.102 1028.48 311.102C960 311.102 891.2 311.102 822.72 311.102C754.08 311.102 685.92 311.102 617.28 311.102C548.8 311.102 480 311.102 411.52 311.102C342.88 311.102 274.72 311.102 206.08 311.102C137.6 311.102 68.8 311.102 34.4 311.102H0V240.102Z" 
              fill="#C62368"
            />
          </g>
        </svg>
      </div>

      {/* Main Footer Content with Higher Z-Index */}
      <div 
        className="relative"
        style={{
          padding: '0 16px',
          maxWidth: '1280px',
          margin: '0 auto',
          zIndex: 10
        }}
      >
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        
        <motion.div 
          className="pt-6 md:pt-20 grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-6"
          style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Header Text */}
          <motion.p 
            className="text-white font-semibold text-base md:text-xl leading-6 md:leading-8 col-span-1 md:col-span-6 lg:col-span-12"
            style={{
              fontSize: '24px',
              lineHeight: '24px',
              width: '70%'
            }}
            variants={itemVariants}
          >
            Elevate your skills! Seamlessly blend the worlds of technology & business together for a future full of{' '}
            <span 
              className="bg-gradient-to-r from-[#E97862] to-[#8461E7] bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to right, #E97862, #8461E7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              endless possibilities.
            </span>
          </motion.p>

          {/* Rest of the content (same as before but with higher z-index) */}
          <motion.div 
            className="col-span-1 md:col-span-6 lg:col-span-3"
            variants={itemVariants}
            style={{ zIndex: 10 }}
          >
            <a href="https://pwskills.com" className="inline-block">
              <div className="flex items-center mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: 'linear-gradient(to right, #8B5CF6, #3B82F6)'
                  }}
                >
                  <span className="text-white font-bold text-lg">PW</span>
                </div>
                <span className="text-white font-bold text-xl">SKILLS</span>
              </div>
            </a>

            {/* Contact Information */}
            <ul className="text-gray-300 space-y-4">
              <li className="flex gap-2 items-center">
                <FaPhone className="w-4 h-4 text-purple-400" />
                <p className="text-sm font-semibold">
                  Contact Us: +91 7349432553
                </p>
              </li>
              <li className="flex gap-2 items-start">
                <FaMapMarkerAlt className="w-5 h-5 text-purple-400 mt-1" />
                <p className="text-sm font-normal leading-5">
                  17th floor Tower A, Brigade Signature Towers, Sannatammanahalli, Bengaluru, Karnataka 562129.
                </p>
              </li>
              <li className="flex gap-2 items-center">
                <FaEnvelope className="w-4 h-4 text-purple-400" />
                <a className="hover:text-gray-100 transition-colors" href="mailto:support@pwskills.com">
                  <p className="text-sm font-normal">
                    Email Us: support@pwskills.com
                  </p>
                </a>
              </li>
            </ul>

            {/* Certificate Logo */}
            <div className="flex flex-wrap gap-2 mt-5">
              <svg className="w-10 h-10" viewBox="0 0 43 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.4984 40.9553C32.4742 40.9553 41.3718 32.0577 41.3718 21.0819C41.3718 10.1061 32.4742 1.2085 21.4984 1.2085C10.5226 1.2085 1.625 10.1061 1.625 21.0819C1.625 32.0577 10.5226 40.9553 21.4984 40.9553Z" fill="white" stroke="#7443DE" strokeWidth="1.33333" strokeMiterlimit="10"/>
                <path d="M21.498 34.6849C29.0109 34.6849 35.1014 28.5944 35.1014 21.0815C35.1014 13.5685 29.0109 7.47803 21.498 7.47803C13.985 7.47803 7.89453 13.5685 7.89453 21.0815C7.89453 28.5944 13.985 34.6849 21.498 34.6849Z" fill="#7443DE"/>
              </svg>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div 
            className="relative flex flex-col gap-8 col-span-1 md:col-span-4 lg:col-span-2"
            variants={itemVariants}
            style={{ zIndex: 10 }}
          >
            <h4 className="text-white font-bold text-base leading-6">
              Company
            </h4>
            <span 
              className="h-0.5 w-full absolute top-10 rounded-sm bg-orange-500"
              style={{
                height: '2px',
                top: '40px'
              }}
            ></span>
            <ul role="list" className="flex flex-col flex-wrap space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index} className="py-2">
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                    <p className="text-sm font-normal leading-5 hover:text-gray-300">
                      {link.name}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories Links */}
          <motion.div 
            className="relative flex flex-col gap-8 col-span-1 md:col-span-6 lg:col-span-5"
            variants={itemVariants}
            style={{ zIndex: 10 }}
          >
            <h4 className="text-white font-bold text-base leading-6">
              Categories
            </h4>
            <span 
              className="h-0.5 w-full md:w-4/5 absolute top-10 rounded-sm bg-orange-500"
              style={{
                height: '2px',
                top: '40px'
              }}
            ></span>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-x-4 space-y-2">
              {categoryLinks.map((link, index) => (
                <li key={index} className="py-2" style={{ minWidth: '250px' }}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                    <p className="text-sm font-normal leading-5 hover:text-gray-300">
                      {link.name}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media Links */}
          <motion.div 
            className="relative col-span-1 md:col-span-2"
            variants={itemVariants}
            style={{ zIndex: 10 }}
          >
            <h4 className="text-white font-bold text-base leading-6">
              Follow Us
            </h4>
            <ul role="list" className="mt-4 md:mt-12 flex flex-wrap">
              <div className="flex md:flex-col flex-wrap gap-x-6 gap-y-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="nofollow"
                    className="text-gray-50 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">{social.name}</span>
                    <div className="flex gap-3 items-center">
                      <social.icon className="w-6 h-6" />
                      <p className="text-sm font-normal leading-5 text-white hover:text-gray-300">
                        {social.name}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider Line */}
        <span 
          className="relative h-0.5 w-full bg-white inline-block mt-8"
          style={{ height: '2px', zIndex: 10 }}
        ></span>

        {/* Bottom Copyright Section */}
        <motion.div 
          className="relative flex flex-col items-start justify-between md:flex-row md:items-center py-4 md:py-8 text-white font-medium leading-6 gap-y-4"
          style={{ fontSize: '14px', zIndex: 10 }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="md:w-1/3">© 2024 PWSkills. All rights reserved.</p>
          <ul className="flex justify-start gap-y-2 md:justify-between items-center flex-wrap gap-x-6">
            <li>
              <a className="hover:text-gray-300 transition-colors duration-300" href="https://pwskills.com/privacy-policy">
                Privacy policy
              </a>
            </li>
            <li>
              <a className="hover:text-gray-300 transition-colors duration-300" href="https://pwskills.com/terms-and-conditions">
                Terms and Conditions
              </a>
            </li>
          </ul>
        </motion.div>
      </div>
    </footer>
  );
};

export default PWSkillsFooter;
