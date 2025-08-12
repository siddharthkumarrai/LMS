"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import axiosInstance from '../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend,
  FiUser,
  FiMessageSquare,
  FiCheck,
  FiClock,
  FiHeadphones,
  FiGlobe
} from 'react-icons/fi';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("All fields are required");
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/contact', formData);
      if (response.data?.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Modern Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]"
        )}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-blue-500/5" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full opacity-20"
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

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <FiMessageSquare className="w-8 h-8 text-blue-500" />
              <h1 className="bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
                Get in Touch
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
            >
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              className="lg:col-span-2"
              variants={containerVariants}
              initial="hidden"
              animate={isFormInView ? "visible" : "hidden"}
            >
              <motion.div
                variants={itemVariants}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-8"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Name Field */}
                  <motion.div variants={itemVariants}>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        required
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all",
                          "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                          "border-slate-200 dark:border-slate-700",
                          "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
                          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                          focusedField === 'name' && "scale-[1.02] shadow-lg"
                        )}
                        placeholder="Enter your full name"
                      />
                      {focusedField === 'name' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div variants={itemVariants}>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        required
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all",
                          "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                          "border-slate-200 dark:border-slate-700",
                          "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
                          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                          focusedField === 'email' && "scale-[1.02] shadow-lg"
                        )}
                        placeholder="Enter your email address"
                      />
                      {focusedField === 'email' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div variants={itemVariants}>
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Message
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        name="message"
                        id="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField('')}
                        required
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all resize-none",
                          "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                          "border-slate-200 dark:border-slate-700",
                          "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
                          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                          focusedField === 'message' && "scale-[1.02] shadow-lg"
                        )}
                        placeholder="Tell us how we can help you..."
                      />
                      {focusedField === 'message' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white py-4 px-6 rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>

            {/* Contact Information Sidebar */}
            <motion.div
              className="lg:col-span-1"
              variants={containerVariants}
              initial="hidden"
              animate={isFormInView ? "visible" : "hidden"}
            >
              <div className="space-y-6">
                {/* Contact Info Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6"
                >
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <FiHeadphones className="w-5 h-5 text-orange-500" />
                    Contact Information
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                    Our team is available to help you with any questions or concerns.
                  </p>

                  <div className="space-y-4">
                    {/* Office Location */}
                    <motion.div 
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiMapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-1">Our Office</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          17th floor Tower A, Brigade Signature Towers, Sannatammanahalli, Bengaluru, Karnataka 562129
                        </p>
                      </div>
                    </motion.div>

                    {/* Phone */}
                    <motion.div 
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPhone className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-1">Phone</h4>
                        <a 
                          href="tel:+917349432553" 
                          className="text-sm text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          +91 7349432553
                        </a>
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div 
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-1">Email</h4>
                        <a 
                          href="mailto:support@pwskills.com" 
                          className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          support@pwskills.com
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Response Time Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 dark:from-orange-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FiClock className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      Response Time
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Email: Within 24 hours
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Phone: During business hours
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiGlobe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Available Mon-Fri, 9 AM - 6 PM IST
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* FAQ Link Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6 text-center"
                >
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Need Quick Answers?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Check out our FAQ section for instant solutions to common questions.
                  </p>
                  <motion.a
                    href="/faqs"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMessageSquare className="w-4 h-4" />
                    View FAQ
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
