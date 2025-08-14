import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice.ts';
import axiosInstance from '../Helpers/axiosInstance';
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const onLogin = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the details");
            return;
        }

        const loadingToast = toast.loading("Logging in...");
        try {
            const response = await axiosInstance.post("/user/login", loginData);
            // 1. Backend se token aur user data ko alag-alag nikalo
            const token = response?.data?.token;
            const user = response?.data?.user;

            // 2. Check karo ki response successful hai aur token/user dono maujood hain
            if (response?.data?.success && token && user) {
                toast.dismiss(loadingToast);
                toast.success("Login successful!");

                // 3. login action ko sahi format mein data bhejo
                dispatch(login({ token, ...user }));

                // User ko uske role ke hisaab se redirect karo
                if (user.role === 'admin') {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                toast.dismiss(loadingToast);
                toast.error(response?.data?.message || "Login failed. Invalid credentials or server error.");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <div className="flex items-center justify-center px-4 py-28">
                <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                        Welcome Back
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
                        Sign in to your account to continue your journey
                    </p>

                    <form className="my-8" onSubmit={onLogin}>
                        {/* Email Input */}
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                type="email"
                                value={loginData.email}
                                onChange={handleUserInput}
                                required
                            />
                        </LabelInputContainer>

                        {/* Password Input */}
                        <LabelInputContainer className="mb-6">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                type="password"
                                value={loginData.password}
                                onChange={handleUserInput}
                                required
                            />
                        </LabelInputContainer>

                        {/* Forgot Password Link - Updated to correct route */}
                        <div className="flex justify-end mb-6">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                            type="submit"
                        >
                            Sign in &rarr;
                            <BottomGradient />
                        </button>

                        {/* Divider */}
                        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                        {/* Social Login Buttons */}
                        <div className="flex flex-col space-y-4">
                            <button
                                className="group/btn shadow-input relative flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] transition-all duration-300 hover:scale-[1.02]"
                                type="button"
                                onClick={() => toast.info("Social login coming soon!")}
                            >
                                <svg className="h-5 w-5 text-neutral-800 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.957 1.404-5.957s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z" />
                                </svg>
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                    Continue with Google
                                </span>
                                <BottomGradient />
                            </button>
                            <button
                                className="group/btn shadow-input relative flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] transition-all duration-300 hover:scale-[1.02]"
                                type="button"
                                onClick={() => toast.info("Social login coming soon!")}
                            >
                                <svg className="h-5 w-5 text-neutral-800 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                    Continue with GitHub
                                </span>
                                <BottomGradient />
                            </button>
                        </div>

                        {/* Signup Link */}
                        <p className="text-center mt-8 text-sm text-neutral-600 dark:text-neutral-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                            >
                                Create one here
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

export default Login;