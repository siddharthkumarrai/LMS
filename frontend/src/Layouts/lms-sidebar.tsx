"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
    BarChart3, BookOpen, Calendar, CreditCard, GraduationCap, HelpCircle,
    Home, Library, MessageSquare, Moon, Settings, Sun, Users, UserCheck,
    Building, FileText, Menu, X, CircleUser 
} from "lucide-react"
import { cn } from "../lib/utils" // Path theek kar lena

// Chhote helper components, inko isi file mein rehne do
const SidebarLink = ({ link }) => (
    <a
        href={link.href}
        className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            link.isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
        )}
    >
        {link.icon}
        <span className="truncate">{link.label}</span>
    </a>
);

const SidebarSection = ({ title, children, className }) => (
    <div className={cn("space-y-1", className)}>
        {title && <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>}
        {children}
    </div>
);

// Yeh aapka main Sidebar Component hai
export default function LMSSidebar() {
    // Yeh state mobile sidebar ko kholne/band karne ke liye hai
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    // Aapka saara purana data aur functions
    const [darkMode, setDarkMode] = useState(false);
    const mainMenuLinks = [
        { label: "Dashboard", href: "#", icon: <Home className="h-5 w-5" />, isActive: true },
        { label: "Analytics", href: "#", icon: <BarChart3 className="h-5 w-5" /> },
        { label: "My Profile", href: "/me", icon: <CircleUser  className="h-5 w-5" /> },
        { label: "My Courses", href: "/my-courses", icon: <MessageSquare className="h-5 w-5" /> },
    ];
    const academicLinks = [
        { label: "Create Course", href: "/course/create", icon: <FileText className="h-5 w-5" /> },
        { label: "Students", href: "#", icon: <Users className="h-5 w-5" /> },
        { label: "Library", href: "#", icon: <Library className="h-5 w-5" /> },
        { label: "Courses", href: "#", icon: <BookOpen className="h-5 w-5" /> },
        { label: "Professors", href: "#", icon: <UserCheck className="h-5 w-5" /> },
        { label: "Department", href: "#", icon: <Building className="h-5 w-5" /> },
        { label: "Financial Record", href: "#", icon: <CreditCard className="h-5 w-5" /> },
    ];
    const otherMenuLinks = [
        { label: "Help & Center", href: "#", icon: <HelpCircle className="h-5 w-5" /> },
        { label: "Settings", href: "#", icon: <Settings className="h-5 w-5" /> },
    ];
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    // Sidebar ka content (HTML) ek alag variable mein
    const sidebarContent = (
        <div className={cn("flex flex-col h-full", darkMode && "dark")}>
            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-800 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg"><GraduationCap className="h-5 w-5 text-white" /></div>
                    <div className="flex flex-col"><span className="font-bold text-gray-900 dark:text-white">Cudemo</span><span className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</span></div>
                </div>
                <SidebarSection title="Main Menu" className="mb-6">{mainMenuLinks.map((link, idx) => <SidebarLink key={idx} link={link} />)}</SidebarSection>
                <SidebarSection title="Academic Management" className="mb-6">{academicLinks.map((link, idx) => <SidebarLink key={idx} link={link} />)}</SidebarSection>
                <SidebarSection title="Other Menu">{otherMenuLinks.map((link, idx) => <SidebarLink key={idx} link={link} />)}</SidebarSection>
            </div>
            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <button onClick={toggleDarkMode} className="flex items-center gap-3 p-2.5 rounded-lg text-sm w-full hover:bg-gray-50 dark:hover:bg-gray-800">{darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}<span>{darkMode ? "Light" : "Dark"}</span></button>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800"><div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><span className="text-white text-sm font-medium">AJ</span></div><div className="flex flex-col min-w-0"><span className="text-sm font-medium text-gray-900 dark:text-white truncate">Alexis Johnson</span><span className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrator</span></div></div>
            </div>
        </div>
    );

    return (
        <div className={cn(darkMode && "dark")}>
            {/* ===== MOBILE HAMBURGER BUTTON ===== */}
            <button className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full shadow-lg" onClick={() => setMobileNavOpen(true)}>
                <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            </button>

            {/* ===== DESKTOP SIDEBAR ===== */}
            <div className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-900 h-screen">
                {sidebarContent}
            </div>

            {/* ===== MOBILE SIDEBAR (OVERLAY) ===== */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setMobileNavOpen(false)} />
                        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 z-50 flex flex-col">
                            <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-800">
                                <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X className="h-6 w-6" /></button>
                            </div>
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}