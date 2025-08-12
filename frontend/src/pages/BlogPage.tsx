"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  FiSearch,
  FiCalendar,
  FiUser,
  FiClock,
  FiArrowRight,
  FiTag,
  FiTrendingUp,
  FiEye,
  FiHeart,
  FiShare2,
  FiBookmark
} from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  views: number;
  likes: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of AI in Education: Transforming Learning Experiences",
    excerpt: "Explore how artificial intelligence is revolutionizing the education sector and creating personalized learning experiences for students worldwide.",
    content: "Full article content here...",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      role: "AI Research Lead"
    },
    publishedAt: "2024-01-15",
    readTime: 8,
    category: "technology",
    tags: ["AI", "Education", "Machine Learning", "Future Tech"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    featured: true,
    views: 12500,
    likes: 245
  },
  {
    id: "2", 
    title: "Mastering Data Science: Essential Skills for 2024",
    excerpt: "Discover the most in-demand data science skills and learn how to build a successful career in this rapidly growing field.",
    content: "Full article content here...",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "Senior Data Scientist"
    },
    publishedAt: "2024-01-12",
    readTime: 6,
    category: "data-science",
    tags: ["Data Science", "Python", "Analytics", "Career"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    featured: false,
    views: 8900,
    likes: 156
  },
  {
    id: "3",
    title: "Building Scalable Web Applications with Modern JavaScript",
    excerpt: "Learn best practices for developing high-performance web applications using the latest JavaScript frameworks and tools.",
    content: "Full article content here...",
    author: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "Full Stack Developer"
    },
    publishedAt: "2024-01-10",
    readTime: 10,
    category: "programming",
    tags: ["JavaScript", "React", "Node.js", "Web Development"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    featured: true,
    views: 15200,
    likes: 298
  },
  {
    id: "4",
    title: "Cybersecurity Trends: Protecting Digital Assets in 2024",
    excerpt: "Stay ahead of cyber threats with insights into the latest security trends and best practices for protecting your digital infrastructure.",
    content: "Full article content here...",
    author: {
      name: "David Kumar",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      role: "Cybersecurity Expert"
    },
    publishedAt: "2024-01-08",
    readTime: 7,
    category: "cybersecurity",
    tags: ["Security", "Cybersecurity", "Privacy", "Tech Trends"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    featured: false,
    views: 6750,
    likes: 123
  },
  {
    id: "5",
    title: "Digital Marketing in the Age of AI: Strategies That Work",
    excerpt: "Discover how AI is transforming digital marketing and learn practical strategies to leverage these technologies for better results.",
    content: "Full article content here...",
    author: {
      name: "Lisa Park",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
      role: "Digital Marketing Strategist"
    },
    publishedAt: "2024-01-05",
    readTime: 5,
    category: "marketing",
    tags: ["Digital Marketing", "AI", "Strategy", "Automation"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    featured: false,
    views: 9340,
    likes: 187
  },
  {
    id: "6",
    title: "Career Transition: From Traditional Role to Tech Professional",
    excerpt: "A comprehensive guide for professionals looking to transition into tech careers, including essential skills and practical steps.",
    content: "Full article content here...",
    author: {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Career Coach"
    },
    publishedAt: "2024-01-03",
    readTime: 9,
    category: "career",
    tags: ["Career Change", "Tech Jobs", "Professional Development", "Skills"],
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    featured: false,
    views: 11100,
    likes: 234
  }
];

const categories: Category[] = [
  { id: "all", name: "All Posts", color: "#8B5CF6", count: blogPosts.length },
  { id: "technology", name: "Technology", color: "#F59E0B", count: blogPosts.filter(post => post.category === "technology").length },
  { id: "data-science", name: "Data Science", color: "#10B981", count: blogPosts.filter(post => post.category === "data-science").length },
  { id: "programming", name: "Programming", color: "#3B82F6", count: blogPosts.filter(post => post.category === "programming").length },
  { id: "cybersecurity", name: "Cybersecurity", color: "#EF4444", count: blogPosts.filter(post => post.category === "cybersecurity").length },
  { id: "marketing", name: "Marketing", color: "#EC4899", count: blogPosts.filter(post => post.category === "marketing").length },
  { id: "career", name: "Career", color: "#6366F1", count: blogPosts.filter(post => post.category === "career").length }
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

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const pageRef = useRef(null);
  const isInView = useInView(pageRef, { once: true, amount: 0.2 });

  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const BlogCard = ({ post, featured = false }: { post: BlogPost, featured?: boolean }) => (
    <motion.article
      className={cn(
        "bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden group cursor-pointer",
        featured && "lg:col-span-2"
      )}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      variants={itemVariants}
    >
      <div className="relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className={cn(
            "w-full object-cover group-hover:scale-110 transition-transform duration-500",
            featured ? "h-64" : "h-48"
          )}
        />
        <div className="absolute top-4 left-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: categories.find(cat => cat.id === post.category)?.color }}
          >
            {categories.find(cat => cat.id === post.category)?.name}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiBookmark className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiShare2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
        
        <h2 className={cn(
          "font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors",
          featured ? "text-2xl" : "text-xl"
        )}>
          {post.title}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiHeart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
          </div>
          
          <motion.button 
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium hover:gap-3 transition-all"
            whileHover={{ x: 5 }}
          >
            Read More
            <FiArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );

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
              <FiTrendingUp className="w-8 h-8 text-orange-500" />
              <h1 className="bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl mt-6">
                Our Blog
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8"
            >
              Stay updated with the latest insights, tutorials, and industry trends from our experts.
            </motion.p>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
              </select>
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
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6 sticky top-8"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <FiTag className="w-5 h-5 text-orange-500" />
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
                          ? "bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-700/30 text-slate-600 dark:text-slate-400"
                      )}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
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

            {/* Blog Content */}
            <motion.div
              className="lg:col-span-3"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2"
                  >
                    <FiTrendingUp className="w-6 h-6 text-orange-500" />
                    Featured Articles
                  </motion.h2>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {featuredPosts.slice(0, 2).map((post) => (
                      <BlogCard key={post.id} post={post} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6"
              >
                Latest Articles
              </motion.h2>
              
              {regularPosts.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-12 text-center"
                >
                  <FiSearch className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    No articles found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {regularPosts.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center mt-12"
                >
                  <motion.button
                    className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Load More Articles
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
