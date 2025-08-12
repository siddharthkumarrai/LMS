"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  FiSearch,
  FiChevronDown,
  FiHelpCircle,
  FiBook,
  FiUsers,
  FiSettings,
  FiCreditCard,
  FiShield,
  FiMonitor,
  FiZap
} from 'react-icons/fi';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count: number;
}

const faqData: FAQItem[] = [
  // General
  {
    id: "general-1",
    question: "What is PWSkills and what do you offer?",
    answer: "PWSkills is a comprehensive learning platform that offers industry-relevant courses in technology, data science, programming, and business skills. We provide live classes, recorded sessions, hands-on projects, and personalized mentorship to help learners advance their careers.",
    category: "general"
  },
  {
    id: "general-2", 
    question: "How do I get started with PWSkills?",
    answer: "Getting started is easy! Simply create an account, browse our course catalog, and enroll in the courses that match your learning goals. You can start with our free introductory courses or jump into our comprehensive paid programs.",
    category: "general"
  },
  {
    id: "general-3",
    question: "Do you offer certificates upon course completion?",
    answer: "Yes! Upon successful completion of our courses, you'll receive industry-recognized certificates that you can add to your LinkedIn profile and resume to showcase your new skills to potential employers.",
    category: "general"
  },

  // Courses
  {
    id: "courses-1",
    question: "What types of courses do you offer?",
    answer: "We offer a wide range of courses including Data Science & Analytics, Software Development, Digital Marketing with AI, Cybersecurity, Product Management, Banking & Finance, and Programming in various languages like Python, Java, and JavaScript.",
    category: "courses"
  },
  {
    id: "courses-2",
    question: "Are the courses self-paced or instructor-led?",
    answer: "We offer both formats! You can choose from self-paced courses that you can complete at your own speed, or join our live instructor-led classes for real-time interaction and immediate feedback.",
    category: "courses"
  },
  {
    id: "courses-3",
    question: "Can I access course materials after completion?",
    answer: "Absolutely! Once you enroll in a course, you have lifetime access to all course materials, including videos, assignments, projects, and any future updates to the curriculum.",
    category: "courses"
  },

  // Account
  {
    id: "account-1",
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address, and we'll send you a secure link to create a new password. If you don't receive the email, check your spam folder.",
    category: "account"
  },
  {
    id: "account-2",
    question: "Can I change my email address?",
    answer: "Yes, you can update your email address in your profile settings. Go to your account dashboard, click on 'Profile Settings', and update your email address. You'll need to verify the new email before the change takes effect.",
    category: "account"
  },
  {
    id: "account-3",
    question: "How do I delete my account?",
    answer: "If you wish to delete your account, please contact our support team at support@pwskills.com. We'll be sad to see you go, but we'll process your request within 48 hours while ensuring all your data is securely removed.",
    category: "account"
  },

  // Payment
  {
    id: "payment-1",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and popular digital wallets. All payments are processed securely through encrypted channels.",
    category: "payment"
  },
  {
    id: "payment-2",
    question: "Is there a refund policy?",
    answer: "Yes! We offer a 7-day money-back guarantee. If you're not satisfied with your course within the first 7 days of enrollment, contact us for a full refund. Please note that this applies only to paid courses.",
    category: "payment"
  },
  {
    id: "payment-3",
    question: "Can I get an invoice for my purchase?",
    answer: "Absolutely! After completing your purchase, you'll automatically receive an invoice via email. You can also download invoices anytime from your account dashboard under 'Billing History'.",
    category: "payment"
  },

  // Technical
  {
    id: "technical-1",
    question: "What are the system requirements?",
    answer: "Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge). For the best experience, we recommend a stable internet connection (minimum 2 Mbps) and updated browser. Mobile apps are available for iOS and Android.",
    category: "technical"
  },
  {
    id: "technical-2",
    question: "I'm having trouble accessing my course. What should I do?",
    answer: "First, try refreshing your browser and clearing your cache. Ensure you're logged in with the correct account. If the issue persists, try a different browser or device. Contact our technical support if you still can't access your course.",
    category: "technical"
  },
  {
    id: "technical-3",
    question: "Can I download videos for offline viewing?",
    answer: "Yes! Our mobile apps allow you to download course videos for offline viewing. This feature is perfect for learning on the go when you don't have a stable internet connection. Downloaded content is available for 30 days.",
    category: "technical"
  }
];

const categories: Category[] = [
  { id: "all", name: "All Questions", icon: FiHelpCircle, color: "#8B5CF6", count: faqData.length },
  { id: "general", name: "General", icon: FiBook, color: "#F59E0B", count: faqData.filter(faq => faq.category === "general").length },
  { id: "courses", name: "Courses", icon: FiMonitor, color: "#10B981", count: faqData.filter(faq => faq.category === "courses").length },
  { id: "account", name: "Account", icon: FiUsers, color: "#3B82F6", count: faqData.filter(faq => faq.category === "account").length },
  { id: "payment", name: "Payment", icon: FiCreditCard, color: "#EF4444", count: faqData.filter(faq => faq.category === "payment").length },
  { id: "technical", name: "Technical", icon: FiSettings, color: "#6366F1", count: faqData.filter(faq => faq.category === "technical").length }
];

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

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const pageRef = useRef(null);
  const isInView = useInView(pageRef, { once: true, amount: 0.2 });

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
    >
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

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
              <FiHelpCircle className="w-8 h-8 text-purple-500" />
              <h1 className="bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl mt-6">
                Frequently Asked Questions
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8"
            >
              Find answers to common questions about our platform, courses, and services.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative max-w-md mx-auto"
            >
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              className="lg:col-span-1"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div
                variants={itemVariants}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <FiBook className="w-5 h-5 text-purple-500" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left",
                        selectedCategory === category.id
                          ? "bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-slate-600 dark:text-slate-400"
                      )}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: selectedCategory === category.id ? `${category.color}20` : 'transparent'
                          }}
                        >
                          <category.icon 
                            className="w-4 h-4" 
                            style={{ color: category.color }}
                          />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* FAQ Content */}
            <motion.div
              className="lg:col-span-3"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredFAQs.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-12 text-center"
                >
                  <FiSearch className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    No results found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden"
                      >
                        <motion.button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <FiHelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">
                              {faq.question}
                            </h3>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FiChevronDown className="w-5 h-5 text-slate-500" />
                          </motion.div>
                        </motion.button>
                        
                        <AnimatePresence>
                          {expandedFAQ === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pl-20">
                                <div className="bg-slate-50/50 dark:bg-slate-700/30 rounded-lg p-4">
                                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Contact Support */}
              <motion.div
                variants={itemVariants}
                className="mt-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 text-center"
              >
                <FiZap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Still have questions?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <motion.a
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiHelpCircle className="w-5 h-5" />
                  Contact Support
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
