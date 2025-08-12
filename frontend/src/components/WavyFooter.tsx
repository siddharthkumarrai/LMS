"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  FaLinkedin, 
  FaYoutube, 
  FaTelegram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaArrowUp
} from 'react-icons/fa';

// TypeScript interfaces
interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Footer data
const companyLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Contact us", href: "/contact" },
  { name: "FAQ", href: "/faqs" },
  { name: "Blog", href: "/blogs" },
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
    name: "LinkedIn", 
    href: "https://in.linkedin.com/in/siddharthkumarrai", 
    icon: FaLinkedin,
    color: "#0077B5"
  },
  { 
    name: "YouTube", 
    href: "https://in.linkedin.com/in/siddharthkumarrai", 
    icon: FaYoutube,
    color: "#FF0000"
  },
  { 
    name: "Telegram", 
    href: "https://in.linkedin.com/in/siddharthkumarrai", 
    icon: FaTelegram,
    color: "#0088CC"
  }
];

// Animation variants
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

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const PWSkillsFooter: React.FC = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative min-h-screen font-sans overflow-hidden"
    >
      {/* 50% Split Background with Wavy Divider */}
      <div className="absolute inset-0">
        {/* Top 50% - Color A (Orange/Pink gradient) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
        
        {/* Bottom 50% - Color B (Blue/Purple gradient) */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600" />
        
        {/* Wavy Divider at 50% height */}
        <div className="absolute top-1/2 left-0 w-full h-24 -translate-y-12">
          {/* Main wavy line */}
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
            style={{ zIndex: 1 }}
          >
            <motion.path 
              d="M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.1)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          
          {/* Animated flowing gradient overlay */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E")`,
              WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E")`,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat'
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>

      {/* Modern Grid Background Overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)]"
        )}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="pt-16 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16 mt-6"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
            >
              Elevate Your Skills
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-md"
              variants={itemVariants}
            >
              Seamlessly blend the worlds of technology & business together for a future full of{' '}
              <motion.span 
                className="font-bold text-yellow-300"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 10px rgba(255,255,0,0.5)",
                    "0 0 20px rgba(255,255,0,0.8)",
                    "0 0 10px rgba(255,255,0,0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                endless possibilities.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand & Contact Info */}
            <motion.div 
              className="lg:col-span-4"
              variants={itemVariants}
            >
              {/* Logo */}
              <motion.div 
                className="flex items-center mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg bg-white/20 backdrop-blur-sm border border-white/30"
                  whileHover={{ rotate: 5 }}
                >
                  <span className="text-white font-bold text-xl">SK</span>
                </motion.div>
                <span className="text-white font-bold text-2xl drop-shadow-lg">SKILLSLMS</span>
              </motion.div>

              {/* Contact Information */}
              <div className="space-y-6">
                {[
                  { icon: FaPhone, text: "Contact Us: +91 9910032074", href: "tel:+919910032074" },
                  { icon: FaEnvelope, text: "Email Us: support@skillslms@gmail.com", href: "mailto:developersiddharthkumarrai@gmail.com" },
                  { icon: FaMapMarkerAlt, text: "17th floor Tower A, Brigade Signature Towers, Sannatammanahalli, Bengaluru, Karnataka 562129.", href: null }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all">
                      <contact.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {contact.href ? (
                        <a 
                          href={contact.href}
                          className="text-white/90 hover:text-white transition-colors text-sm leading-relaxed drop-shadow-sm"
                        >
                          {contact.text}
                        </a>
                      ) : (
                        <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
                          {contact.text}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Certificate Badge */}
              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
                  <svg className="w-6 h-6" viewBox="0 0 43 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4984 40.9553C32.4742 40.9553 41.3718 32.0577 41.3718 21.0819C41.3718 10.1061 32.4742 1.2085 21.4984 1.2085C10.5226 1.2085 1.625 10.1061 1.625 21.0819C1.625 32.0577 10.5226 40.9553 21.4984 40.9553Z" fill="white" stroke="#7443DE" strokeWidth="1.33333" strokeMiterlimit="10"/>
                    <path d="M21.498 34.6849C29.0109 34.6849 35.1014 28.5944 35.1014 21.0815C35.1014 13.5685 29.0109 7.47803 21.498 7.47803C13.985 7.47803 7.89453 13.5685 7.89453 21.0815C7.89453 28.5944 13.985 34.6849 21.498 34.6849Z" fill="#7443DE"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Certified Platform</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Company Links */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 drop-shadow-lg">
                <span>Company</span>
                <motion.div 
                  className="h-0.5 flex-1 bg-white/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 * index }}
                  >
                    <motion.a 
                      href={link.href} 
                      className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group drop-shadow-sm"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Categories */}
            <motion.div 
              className="lg:col-span-4"
              variants={itemVariants}
            >
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 drop-shadow-lg">
                <span>Categories</span>
                <motion.div 
                  className="h-0.5 flex-1 bg-white/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 * index }}
                  >
                    <motion.a 
                      href={link.href} 
                      className="text-white/80 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group drop-shadow-sm"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social Media */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 drop-shadow-lg">
                <span>Follow Us</span>
                <motion.div 
                  className="h-0.5 flex-1 bg-white/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </h4>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="nofollow"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 group"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 * index }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all group-hover:bg-white/30">
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium drop-shadow-sm">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="mt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-white/80 text-sm drop-shadow-sm">
              © 2024 SkillsLMS. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <motion.a 
                href="/privacy-policy"
                className="text-white/80 hover:text-white transition-colors text-sm drop-shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="/privacy-policy"
                className="text-white/80 hover:text-white transition-colors text-sm drop-shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                Terms and Conditions
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default PWSkillsFooter;
