"use client";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { motion } from "motion/react";
import toast from 'react-hot-toast';
import axiosInstance from '../Helpers/axiosInstance';
import { cn } from "../lib/utils";

// Animated Boxes Component
export const BoxesCore = ({ className, ...rest }) => {
    const rows = new Array(150).fill(1);
    const cols = new Array(100).fill(1);
    let colors = [
        "#93c5fd",
        "#f9a8d4",
        "#86efac",
        "#fde047",
        "#fca5a5",
        "#d8b4fe",
        "#93c5fd",
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
                    className="relative h-8 w-16 border-l border-slate-700"
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
                            className="relative h-8 w-16 border-t border-r border-slate-700"
                        >
                            {j % 2 === 0 && i % 2 === 0 ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
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
        <div className="relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
            <div className="absolute inset-0 bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <div className="relative h-[100vh] z-20 flex items-center justify-center -mt-6">
                <motion.form
                    onSubmit={onFormSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col justify-center rounded-xl p-4 w-full max-w-4xl bg-slate-800/80 backdrop-blur-sm border border-slate-700 shadow-2xl"
                >
                    <motion.div
                        className="text-center space-y-2 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Create New Course
                        </h1>
                        <p className="text-slate-400">Fill in the details to create your course</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-white">Course Thumbnail</label>
                                <label className="cursor-pointer group" htmlFor="image_uploads">
                                    {userInput.previewImage ? (
                                        <motion.img
                                            whileHover={{ scale: 1.02 }}
                                            className="w-full h-48 object-cover rounded-lg border-2 border-slate-600 group-hover:border-blue-400 transition-colors"
                                            src={userInput.previewImage}
                                            alt="course thumbnail"
                                        />
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.02, borderColor: "#60a5fa" }}
                                            className="w-full h-48 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-700/50 group-hover:bg-slate-700 transition-all"
                                        >
                                            <div className="text-center">
                                                <svg className="w-12 h-12 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                                <p className="text-slate-300 font-medium">Upload Course Thumbnail</p>
                                                <p className="text-slate-500 text-sm">PNG, JPG, JPEG, WEBP</p>
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

                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-white" htmlFor="title">
                                    Course Title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={handleUserInput}
                                    value={userInput.title}
                                />
                            </div>
                        </motion.div>

                        {/* Right Side */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-white" htmlFor="category">
                                    Course Category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={handleUserInput}
                                    value={userInput.category}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-white" htmlFor="price">
                                    Course Price
                                </label>
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="Enter course price"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={handleUserInput}
                                    value={userInput.price}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-white" htmlFor="description">
                                    Course Description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none h-32"
                                    onChange={handleUserInput}
                                    value={userInput.description}
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Create Course
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default CreateCourse;
