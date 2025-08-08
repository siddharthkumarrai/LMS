import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router'; // Corrected to react-router-dom
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice.ts';
import axiosInstance from '../Helpers/axiosInstance';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState("");
    const [errors, setErrors] = useState({});
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null,
    });

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!signupData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (signupData.name.trim().length < 4) { // As per your code
            newErrors.name = "Name must be at least 4 characters long";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!signupData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(signupData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!signupData.password) {
            newErrors.password = "Password is required";
        } else if (signupData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }

        // Avatar validation
        if (!signupData.avatar) {
            newErrors.avatar = "Profile picture is required";
        }

        // `setErrors` yahan se hata diya gaya hai.
        // Sirf errors ka object return hoga.
        return newErrors;
    };

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
        
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const getImage = (e) => {
        const uploadedImage = e.target.files[0];
        
        if (uploadedImage) {
            // ... (Aapka getImage ka poora code yahan waisa hi rahega, usmein koi galti nahi hai)
            setSignupData(prevData => ({ ...prevData, avatar: uploadedImage }));
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                setPreviewImage(event.target.result);
            };
            fileReader.readAsDataURL(uploadedImage);
        }
    };

    const createNewAccount = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error(Object.values(validationErrors)[0]);
            return;
        }

        const formData = new FormData();
        formData.append("name", signupData.name);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);


        const isAdminRegistration = location.pathname.includes('/instructor');
        
        // API endpoint ko conditionally set karein
        const apiEndpoint = isAdminRegistration 
            ? "/user/register/admin" 
            : "/user/register";
        
        console.log("Submitting to:", apiEndpoint); // Debugging ke liye

        const loadingToast = toast.loading("Creating account...");
        try {
            const response = await axiosInstance.post(apiEndpoint, formData);
            
            if (response.data?.success) {
                toast.dismiss(loadingToast);
                toast.success("Account created successfully!");
                dispatch(login(response.data.userData));
                navigate("/");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Plese try again later");
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-[90vh] py-24">
                <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                        Create Your Account
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
                        Join us today and start your journey with our platform
                    </p>

                    <form className="my-8" onSubmit={createNewAccount}>
                        {/* Avatar upload section */}
                        <div className="mb-6 flex flex-col items-center">
                            <Label htmlFor="image_uploads" className="mb-2">Profile Picture *</Label>
                            <div className="relative">
                                <label htmlFor="image_uploads" className="cursor-pointer group block">
                                    {previewImage ? (
                                        <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 ${errors.avatar ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} group-hover:border-blue-500 transition-colors duration-300`}>
                                            <img 
                                                className="w-full h-full object-cover" 
                                                src={previewImage} 
                                                alt="Profile preview" 
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-2 border-dashed ${errors.avatar ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} group-hover:border-blue-500 transition-colors duration-300`}>
                                            <div className="text-center">
                                                <svg className="w-6 h-6 mx-auto mb-1 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300">Upload</p>
                                            </div>
                                        </div>
                                    )}
                                </label>
                                <input 
                                    onChange={getImage} 
                                    className="hidden" 
                                    type="file" 
                                    id="image_uploads" 
                                    name="image_uploads" 
                                    accept="image/*"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                {previewImage ? "Click to change your profile picture" : "Click to upload your profile picture"}
                            </p>
                            {errors.avatar && (
                                <p className="text-xs text-red-500 mt-1 text-center">{errors.avatar}</p>
                            )}
                        </div>

                        {/* Name Input */}
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                name="name"
                                placeholder="Enter your full name" 
                                type="text" 
                                value={signupData.name}
                                onChange={handleUserInput}
                                className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                            )}
                        </LabelInputContainer>

                        {/* Email Input */}
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                name="email"
                                placeholder="Enter your email address" 
                                type="email" 
                                value={signupData.email}
                                onChange={handleUserInput}
                                className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                        </LabelInputContainer>

                        {/* Password Input */}
                        <LabelInputContainer className="mb-8">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                name="password"
                                placeholder="Create a secure password" 
                                type="password" 
                                value={signupData.password}
                                onChange={handleUserInput}
                                className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                        </LabelInputContainer>

                        {/* Submit Button */}
                        <button
                            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                            type="submit"
                        >
                            Create Account &rarr;
                            <BottomGradient />
                        </button>

                        {/* Login Link */}
                        <p className="text-center mt-6 text-sm text-neutral-600 dark:text-neutral-400">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};

export default Signup;