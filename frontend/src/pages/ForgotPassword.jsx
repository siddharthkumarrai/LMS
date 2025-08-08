import React, { useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../redux/features/auth/authSlice';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return;
        }

        try {
            await dispatch(forgotPassword(email)).unwrap();
            setIsSubmitted(true);
        } catch (error) {
            // Error handling is done in the thunk
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center px-4 py-28">
                <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                className="w-full rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Try Different Email
                            </button>
                            <Link
                                to="/login"
                                className="block w-full rounded-md bg-gradient-to-br from-black to-neutral-600 py-2 px-4 text-center text-sm font-medium text-white hover:scale-[1.02] transition-transform dark:from-zinc-900 dark:to-zinc-900"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center px-4 py-28">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                    Forgot Password?
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
                    Enter your email address and we'll send you a link to reset your password
                </p>

                <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-6">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="Enter your email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </LabelInputContainer>

                    <button
                        className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                        type="submit"
                        disabled={loading || !email}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'} &rarr;
                        <BottomGradient />
                    </button>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
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

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};

export default ForgotPassword;