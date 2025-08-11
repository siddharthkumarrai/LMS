"use client";

import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ComponentType<any>;
}

const faqData: FAQItem[] = [
  {
    id: "course-info",
    question: "Where can I see the course information?",
    answer: "You can find detailed course information in your dashboard under the 'Courses' section. Each course has a dedicated page with curriculum, instructor details, and learning objectives.",
    icon: BookOpenIcon
  },
  {
    id: "live-class",
    question: "How to join the live class?",
    answer: "Live classes can be joined through the 'Live Sessions' tab in your course dashboard. You'll receive email notifications 15 minutes before each session with the join link.",
    icon: PlayCircleIcon
  },
  {
    id: "recorded-classes",
    question: "Where do I find the recorded classes?",
    answer: "All recorded classes are available in the 'Recordings' section of your course. They're organized by date and topic, and include searchable transcripts.",
    icon: DocumentTextIcon
  },
  {
    id: "practice-questions",
    question: "Where do I find the practice questions/assignments and their solutions?",
    answer: "Practice materials are located in the 'Assignments' tab. Each assignment includes detailed solutions and explanatory videos to help you understand the concepts better.",
    icon: PuzzlePieceIcon
  }
];

export function ModernHelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleFAQs = showMore ? filteredFAQs : filteredFAQs.slice(0, 4);

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black">
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      
      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-500" />
            <h1 className="bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
              Help Center
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 mb-8"
          >
            Tell us how we can help 👋
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative max-w-md mx-auto"
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            <input
              type="text"
              placeholder="Type your query here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-300"
            />
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {visibleFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden"
              >
                <motion.button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <faq.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="w-5 h-5 text-neutral-500" />
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
                      <div className="px-6 pb-6 pl-20 text-neutral-600 dark:text-neutral-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Show More Button */}
          {filteredFAQs.length > 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center pt-4"
            >
              <motion.button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showMore ? "Show Less" : "Show More"} ↓
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-blue-600" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
              />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Still need help, Have Queries
          </h3>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Have Queries? Please get in touch & we will happy to help you
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
