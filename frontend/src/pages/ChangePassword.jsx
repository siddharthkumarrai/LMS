import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../redux/features/auth/authSlice';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Clear success message when user starts typing
        if (isSuccess) {
            setIsSuccess(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!passwords.oldPassword) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!passwords.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwords.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        } else if (passwords.oldPassword === passwords.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        if (!passwords.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            })).unwrap();
            
            // Reset form on success
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsSuccess(true);
        } catch (error) {
            // Error handling is done in the thunk
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="flex items-center justify-center px-4 py-28">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                    Change Password
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
                    Update your password to keep your account secure
                </p>

                {isSuccess && (
                    <div className="my-4 p-3 rounded-md bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-600">
                        <p className="text-sm text-green-700 dark:text-green-300 text-center">
                            Password changed successfully!
                        </p>
                    </div>
                )}

                <form className="my-8" onSubmit={handleSubmit}>
                    {/* Current Password Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="oldPassword"
                                name="oldPassword"
                                placeholder="Enter your current password"
                                type={showPasswords.oldPassword ? "text" : "password"}
                                value={passwords.oldPassword}
                                onChange={handleInputChange}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => togglePasswordVisibility('oldPassword')}
                                disabled={loading}
                            >
                                {showPasswords.oldPassword ? (
                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>
                        )}
                    </LabelInputContainer>

                    {/* New Password Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                placeholder="Enter your new password"
                                type={showPasswords.newPassword ? "text" : "password"}
                                value={passwords.newPassword}
                                onChange={handleInputChange}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => togglePasswordVisibility('newPassword')}
                                disabled={loading}
                            >
                                {showPasswords.newPassword ? (
                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                        )}
                    </LabelInputContainer>

                    {/* Confirm Password Input */}
                    <LabelInputContainer className="mb-6">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your new password"
                                type={showPasswords.confirmPassword ? "text" : "password"}
                                value={passwords.confirmPassword}
                                onChange={handleInputChange}
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                disabled={loading}
                            >
                                {showPasswords.confirmPassword ? (
                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </LabelInputContainer>

                    {/* Password Requirements */}
                    <div className="mb-6 text-xs text-neutral-500 dark:text-neutral-400">
                        <p>Password requirements:</p>
                        <ul className="mt-1 space-y-1">
                            <li className="flex items-center">
                                <span className={cn("mr-2", passwords.newPassword.length >= 6 ? "text-green-500" : "text-red-500")}>
                                    {passwords.newPassword.length >= 6 ? "✓" : "✗"}
                                </span>
                                At least 6 characters long
                            </li>
                            <li className="flex items-center">
                                <span className={cn("mr-2", passwords.oldPassword && passwords.newPassword && passwords.oldPassword !== passwords.newPassword ? "text-green-500" : "text-red-500")}>
                                    {passwords.oldPassword && passwords.newPassword && passwords.oldPassword !== passwords.newPassword ? "✓" : "✗"}
                                </span>
                                Different from current password
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
                        type="submit"
                        disabled={loading || !passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}
                    >
                        {loading ? 'Changing...' : 'Change Password'} &rarr;
                        <BottomGradient />
                    </button>
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

export default ChangePassword;