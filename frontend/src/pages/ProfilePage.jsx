import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile, changePassword, logout } from '../redux/features/auth/authSlice';
import { 
    FiCamera, 
    FiLock, 
    FiLogOut, 
    FiEye, 
    FiEyeOff, 
    FiUser,
    FiShield,
    FiEdit3,
    FiSave,
    FiX,
    FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.data);
    const { loading } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [avatarPreview, setAvatarPreview] = useState('');
    const fileInputRef = useRef(null);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    useEffect(() => {
        if (userData) {
            setFormData(userData);
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'address' && typeof formData[key] === 'object') {
                Object.keys(formData.address).forEach(addrKey => {
                    dataToSubmit.append(`address[${addrKey}]`, formData.address[addrKey]);
                });
            } else if (key !== 'avatar') {
                dataToSubmit.append(key, formData[key]);
            }
        });

        if (fileInputRef.current.files[0]) {
            dataToSubmit.append('avatar', fileInputRef.current.files[0]);
        }

        const result = await dispatch(updateProfile(dataToSubmit));

        if (updateProfile.fulfilled.match(result)) {
            setIsEditMode(false);
            setAvatarPreview('');
        }
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.oldPassword) {
            newErrors.oldPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        } else if (passwordData.oldPassword === passwordData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) {
            return;
        }

        try {
            await dispatch(changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            })).unwrap();
            
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            // Error handling is done in the thunk
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            dispatch(logout());
            toast.success('Logged out successfully!');
            navigate('/login');
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setAvatarPreview('');
        setFormData(userData);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (!userData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-slate-600 dark:text-slate-400">Loading Profile...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 mt-16">
            <div className="container mx-auto py-6  md:p-8 -mt-32 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20"
                >
                    {/* Header with Avatar and User Info */}
                    <div className="p-8 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group"
                                >
                                    <div className="relative">
                                        <motion.img 
                                            layoutId="profile-avatar"
                                            className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-600 object-cover shadow-lg" 
                                            src={avatarPreview || userData.avatar?.secureUrl || '/default-avatar.png'} 
                                            alt="Profile" 
                                        />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity" />
                                        
                                        {isEditMode && activeTab === 'profile' && (
                                            <>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    ref={fileInputRef} 
                                                    onChange={handleImageChange} 
                                                    className="hidden" 
                                                />
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    type="button" 
                                                    onClick={() => fileInputRef.current.click()} 
                                                    className="absolute -bottom-1 -right-1 bg-orange-500 p-2.5 rounded-full text-white hover:bg-orange-600 shadow-lg border-2 border-white dark:border-slate-800 transition-colors"
                                                >
                                                    <FiCamera className="w-4 h-4" />
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                                
                                <div className="space-y-1">
                                    <motion.h1 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
                                    >
                                        {userData.name}
                                    </motion.h1>
                                    <motion.p 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                    >
                                        <span>{userData.email}</span>
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                                    >
                                        <span className="capitalize">{userData.role}</span>
                                    </motion.div>
                                </div>
                            </div>
                            
                            {/* Logout Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="self-start md:self-center flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <FiLogOut className="w-4 h-4" />
                                <span className="font-medium">Logout</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="px-8 border-b border-slate-200 dark:border-slate-700">
                        <nav className="flex gap-1">
                            {[
                                { id: 'profile', label: 'Profile Details', icon: FiUser },
                                { id: 'security', label: 'Security', icon: FiShield }
                            ].map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                                        activeTab === tab.id 
                                            ? 'text-orange-600 dark:text-orange-400' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                    
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </nav>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="p-8"
                            >
                                <form onSubmit={handleFormSubmit}>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Profile Information</h2>
                                            <p className="text-slate-600 dark:text-slate-400 mt-1">Update your account details and preferences</p>
                                        </div>
                                        
                                        {!isEditMode ? (
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button" 
                                                onClick={() => setIsEditMode(true)} 
                                                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                                Edit Profile
                                            </motion.button>
                                        ) : (
                                            <div className="flex gap-3">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button" 
                                                    onClick={handleCancel} 
                                                    className="flex items-center gap-2 bg-slate-500 text-white px-6 py-3 rounded-xl hover:bg-slate-600 transition-all font-medium"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                    Cancel
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="submit" 
                                                    disabled={loading}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                                                >
                                                    <FiSave className="w-4 h-4" />
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ModernInputField label="Full Name" name="name" value={formData.name || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                        <ModernSelectField label="Gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} disabled={!isEditMode} options={['Male', 'Female', 'Other']} />
                                        <ModernInputField label="Contact Number" name="contactNumber" value={formData.contactNumber || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                        <ModernInputField label="Email" name="email" value={userData.email} disabled />
                                        <ModernInputField label="State" name="address.state" value={formData.address?.state || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                        <ModernInputField label="City" name="address.city" value={formData.address?.city || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                        <ModernInputField label="Pincode" name="address.pincode" value={formData.address?.pincode || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Security Tab Content */}
                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="p-8"
                            >
                                <div className="max-w-md">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <FiLock className="w-6 h-6 text-orange-500" />
                                            Password & Security
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1">Keep your account secure by updating your password</p>
                                    </div>
                                    
                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        {/* Current Password */}
                                        <ModernPasswordField
                                            label="Current Password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            showPassword={showPasswords.oldPassword}
                                            toggleVisibility={() => togglePasswordVisibility('oldPassword')}
                                            error={passwordErrors.oldPassword}
                                            disabled={loading}
                                            placeholder="Enter current password"
                                        />

                                        {/* New Password */}
                                        <ModernPasswordField
                                            label="New Password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            showPassword={showPasswords.newPassword}
                                            toggleVisibility={() => togglePasswordVisibility('newPassword')}
                                            error={passwordErrors.newPassword}
                                            disabled={loading}
                                            placeholder="Enter new password"
                                        />

                                        {/* Confirm Password */}
                                        <ModernPasswordField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            showPassword={showPasswords.confirmPassword}
                                            toggleVisibility={() => togglePasswordVisibility('confirmPassword')}
                                            error={passwordErrors.confirmPassword}
                                            disabled={loading}
                                            placeholder="Confirm new password"
                                        />

                                        {/* Password Requirements */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                                        >
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Password requirements:</p>
                                            <div className="space-y-2">
                                                <PasswordRequirement
                                                    met={passwordData.newPassword.length >= 6}
                                                    text="At least 6 characters long"
                                                />
                                                <PasswordRequirement
                                                    met={passwordData.oldPassword && passwordData.newPassword && passwordData.oldPassword !== passwordData.newPassword}
                                                    text="Different from current password"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Submit Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                            className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Changing Password...
                                                </>
                                            ) : (
                                                <>
                                                    <FiLock className="w-4 h-4" />
                                                    Change Password
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

// Modern Helper Components
const ModernInputField = ({ label, disabled, error, ...props }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
    >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <input 
            {...props} 
            disabled={disabled} 
            className={cn(
                "w-full px-4 py-3 rounded-xl border transition-all",
                "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                "border-slate-200 dark:border-slate-700",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500",
                "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
        />
        {error && (
            <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm flex items-center gap-1"
            >
                <span>⚠</span> {error}
            </motion.p>
        )}
    </motion.div>
);

const ModernSelectField = ({ label, options, disabled, error, ...props }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
    >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <select 
            {...props} 
            disabled={disabled} 
            className={cn(
                "w-full px-4 py-3 rounded-xl border transition-all",
                "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                "border-slate-200 dark:border-slate-700",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
                "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
        >
            <option value="">Select {label}...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && (
            <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm flex items-center gap-1"
            >
                <span>⚠</span> {error}
            </motion.p>
        )}
    </motion.div>
);

const ModernPasswordField = ({ 
    label, 
    showPassword, 
    toggleVisibility, 
    disabled, 
    error, 
    ...props 
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
    >
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="relative">
            <input
                {...props}
                type={showPassword ? "text" : "password"}
                disabled={disabled}
                className={cn(
                    "w-full px-4 py-3 pr-12 rounded-xl border transition-all",
                    "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                    "border-slate-200 dark:border-slate-700",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
                    "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500",
                    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                )}
            />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                onClick={toggleVisibility}
                disabled={disabled}
            >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </motion.button>
        </div>
        {error && (
            <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm flex items-center gap-1"
            >
                <span>⚠</span> {error}
            </motion.p>
        )}
    </motion.div>
);

const PasswordRequirement = ({ met, text }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            met ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"
        )}
    >
        <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={cn(
                "flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold",
                met ? "bg-green-100 dark:bg-green-900/30" : "bg-slate-100 dark:bg-slate-800"
            )}
        >
            {met ? <FiCheck className="w-3 h-3" /> : "•"}
        </motion.span>
        {text}
    </motion.div>
);

export default ProfilePage;
