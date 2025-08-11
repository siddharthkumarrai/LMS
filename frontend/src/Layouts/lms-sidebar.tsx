"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import {
    BarChart3, BookOpen, Calendar, CreditCard, GraduationCap, HelpCircle,
    Home, Library, MessageSquare, Moon, Settings, Sun, Users, UserCheck,
    Building, FileText, Menu, X, CircleUser 
} from "lucide-react"
import { cn } from "../lib/utils" // Path theek kar lena

// Helper components
const SidebarLink = ({ link, currentPath }) => {
    // Check if link is active based on current path
    const isActive = currentPath === link.href || 
                    (link.href !== '/' && currentPath.startsWith(link.href));

    return (
        <a
            href={link.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
        >
            {link.icon}
            <span className="truncate">{link.label}</span>
        </a>
    );
};

const SidebarSection = ({ title, children, className }) => (
    <div className={cn("space-y-1", className)}>
        {title && <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>}
        {children}
    </div>
);

// Main Sidebar Component
export default function LMSSidebar() {
    // Redux state
    const { role, data: userData } = useSelector((state:any) => state.auth);
    
    // Local state
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Check if user is admin (case-insensitive)
    const isAdmin = role?.toLowerCase() === 'admin';

    // Get current pathname for active link detection
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Admin navigation links
    const adminLinks = {
        mainMenu: [
            { label: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
            { label: "My Profile", href: "/me", icon: <CircleUser className="h-5 w-5" /> },
        ],
        academicManagement: [
            { label: "Create Course", href: "/course/create", icon: <FileText className="h-5 w-5" /> },
            { label: "Students", href: "/students", icon: <Users className="h-5 w-5" /> },
            { label: "My Courses", href: "/my-courses", icon: <BookOpen className="h-5 w-5" /> },
        ],
        otherMenu: [
            { label: "Help & Center", href: "/help-center", icon: <HelpCircle className="h-5 w-5" /> },
            { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
        ]
    };

    // Regular user navigation links
    const userLinks = {
        mainMenu: [
            { label: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
            { label: "My Profile", href: "/me", icon: <CircleUser className="h-5 w-5" /> },
            { label: "My Courses", href: "/my-courses", icon: <MessageSquare className="h-5 w-5" /> },
        ],
        otherMenu: [
            { label: "Help & Center", href: "/help-center", icon: <HelpCircle className="h-5 w-5" /> },
            { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
        ]
    };

    // Select appropriate links based on role
    const currentLinks = isAdmin ? adminLinks : userLinks;

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    // Get user initials for avatar fallback
    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Sidebar content
    const sidebarContent = (
        <div className={cn("flex flex-col h-full", darkMode && "dark")}>
            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Logo/Brand Section */}
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-800 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">Cudemo</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {isAdmin ? "Admin Panel" : "Student Panel"}
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <SidebarSection title="Main Menu" className="mb-6">
                    {currentLinks.mainMenu.map((link, idx) => (
                        <SidebarLink key={idx} link={link} currentPath={currentPath} />
                    ))}
                </SidebarSection>

                {/* Academic Management Section (Only for Admin) */}
                {isAdmin && (
                    <SidebarSection title="Academic Management" className="mb-6">
                        {currentLinks.academicManagement.map((link, idx) => (
                            <SidebarLink key={idx} link={link} currentPath={currentPath} />
                        ))}
                    </SidebarSection>
                )}

                {/* Other Menu Section */}
                <SidebarSection title="Other Menu">
                    {currentLinks.otherMenu.map((link, idx) => (
                        <SidebarLink key={idx} link={link} currentPath={currentPath} />
                    ))}
                </SidebarSection>
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                {/* Dark Mode Toggle */}
                <button 
                    onClick={toggleDarkMode} 
                    className="flex items-center gap-3 p-2.5 rounded-lg text-sm w-full hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span>{darkMode ? "Light" : "Dark"}</span>
                </button>

                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                        {userData?.avatar?.secureUrl ? (
                            <img 
                                src={userData.avatar.secureUrl} 
                                alt={userData.name || "User"} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-sm font-medium">
                                {getUserInitials(userData?.name)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {userData?.name || "User"}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {userData?.email || "User"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn(darkMode && "dark")}>
            {/* Mobile Hamburger Button */}
            <button 
                className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full shadow-lg" 
                onClick={() => setMobileNavOpen(true)}
            >
                <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-900 h-screen">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar (Overlay) */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-black/60 z-40" 
                            onClick={() => setMobileNavOpen(false)} 
                        />
                        <motion.div 
                            initial={{ x: "-100%" }} 
                            animate={{ x: 0 }} 
                            exit={{ x: "-100%" }} 
                            transition={{ duration: 0.3, ease: "easeInOut" }} 
                            className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 z-50 flex flex-col"
                        >
                            <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-800">
                                <button 
                                    onClick={() => setMobileNavOpen(false)} 
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}