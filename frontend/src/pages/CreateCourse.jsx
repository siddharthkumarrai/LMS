"use client";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { motion } from "motion/react";
import toast from 'react-hot-toast';
import axiosInstance from '../Helpers/axiosInstance';
import { cn } from "../lib/utils";

// Animated Boxes Component - Optimized for performance
export const BoxesCore = ({ className, ...rest }) => {
    // Reduced grid size for better performance on mobile
    const rows = new Array(80).fill(1);
    const cols = new Array(60).fill(1);
    let colors = [
        "#93c5fd",
        "#f9a8d4", 
        "#86efac",
        "#fde047",
        "#fca5a5",
        "#d8b4fe",
        "#a5b4fc",
        "#c4b5fd",
    ];
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div
            style={{
                transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
            }}
            className={cn(
                "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
                className,
            )}
            {...rest}
        >
            {rows.map((_, i) => (
                <motion.div
                    key={`row` + i}
                    className="relative h-6 w-12 border-l border-slate-700 sm:h-8 sm:w-16"
                >
                    {cols.map((_, j) => (
                        <motion.div
                            whileHover={{
                                backgroundColor: `${getRandomColor()}`,
                                transition: { duration: 0 },
                            }}
                            animate={{
                                transition: { duration: 2 },
                            }}
                            key={`col` + j}
                            className="relative h-6 w-12 border-t border-r border-slate-700 sm:h-8 sm:w-16"
                        >
                            {j % 2 === 0 && i % 2 === 0 ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="pointer-events-none absolute -top-[10px] -left-[16px] h-4 w-6 stroke-[1px] text-slate-700 sm:-top-[14px] sm:-left-[22px] sm:h-6 sm:w-10"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v12m6-6H6"
                                    />
                                </svg>
                            ) : null}
                        </motion.div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};

export const Boxes = React.memo(BoxesCore);

const CreateCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
        thumbnail: null,
        previewImage: ''
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                });
            });
        }
    };

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if (!userInput.title || !userInput.description || !userInput.category || !userInput.price || !userInput.thumbnail) {
            toast.error("All fields are mandatory");
            return;
        }

        const formData = new FormData();
        formData.append("title", userInput.title);
        formData.append("description", userInput.description);
        formData.append("category", userInput.category);
        formData.append("price", userInput.price);
        formData.append("thumbnail", userInput.thumbnail);

        const loadingToast = toast.loading("Creating new course...");
        try {
            const response = await axiosInstance.post('/courses', formData);
            if (response.data?.success) {
                toast.dismiss(loadingToast);
                toast.success("Course created successfully!");
                navigate('/dashboard');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            
            {/* Animated boxes background - hidden on very small screens for performance */}
            <div className="hidden sm:block">
                <Boxes />
            </div>
            
            {/* Main content container */}
            <div className="relative z-20 w-full min-h-screen flex items-center justify-center p-4 py-8">
                <motion.form
                    onSubmit={onFormSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-6xl bg-slate-800/90 backdrop-blur-sm border border-slate-700 shadow-2xl rounded-xl p-4 sm:p-6 lg:p-8"
                >
                    {/* Header Section */}
                    <motion.div
                        className="text-center space-y-2 mb-6 sm:mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Create New Course
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base">Fill in the details to create your course</p>
                    </motion.div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                        {/* Left Column - Thumbnail and Title */}
                        <motion.div
                            className="space-y-4 sm:space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {/* Course Thumbnail */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-white">Course Thumbnail</label>
                                <label className="cursor-pointer group block" htmlFor="image_uploads">
                                    {userInput.previewImage ? (
                                        <motion.img
                                            whileHover={{ scale: 1.02 }}
                                            className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-lg border-2 border-slate-600 group-hover:border-blue-400 transition-colors"
                                            src={userInput.previewImage}
                                            alt="course thumbnail"
                                        />
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.02, borderColor: "#60a5fa" }}
                                            className="w-full h-40 sm:h-48 lg:h-56 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-700/50 group-hover:bg-slate-700 transition-all"
                                        >
                                            <div className="text-center p-4">
                                                <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                                <p className="text-slate-300 font-medium text-sm sm:text-base">Upload Course Thumbnail</p>
                                                <p className="text-slate-500 text-xs sm:text-sm mt-1">PNG, JPG, JPEG, WEBP</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png, .webp"
                                    name="image_uploads"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* Course Title */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-white" htmlFor="title">
                                    Course Title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                    onChange={handleUserInput}
                                    value={userInput.title}
                                />
                            </div>
                        </motion.div>

                        {/* Right Column - Category, Price, Description */}
                        <motion.div
                            className="space-y-4 sm:space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {/* Course Category */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-white" htmlFor="category">
                                    Course Category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                    onChange={handleUserInput}
                                    value={userInput.category}
                                />
                            </div>

                            {/* Course Price */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-white" htmlFor="price">
                                    Course Price
                                </label>
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="Enter course price"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                    onChange={handleUserInput}
                                    value={userInput.price}
                                />
                            </div>

                            {/* Course Description */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-white" htmlFor="description">
                                    Course Description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none h-24 sm:h-32 text-sm sm:text-base"
                                    onChange={handleUserInput}
                                    value={userInput.description}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                        className="mt-6 sm:mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            Create Course
                        </motion.button>
                    </motion.div>

                    {/* Optional: Back to Dashboard Link */}
                    <motion.div 
                        className="mt-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Link 
                            to="/dashboard" 
                            className="text-slate-400 hover:text-blue-400 transition-colors text-sm sm:text-base inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </motion.div>
                </motion.form>
            </div>
        </div>
    );
};

export default CreateCourse;