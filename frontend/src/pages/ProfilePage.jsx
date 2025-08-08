import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { updateProfile, changePassword, logout } from '../redux/features/auth/authSlice';
import { FiCamera, FiLock, FiLogOut, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
        
        // Clear errors when user starts typing
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
            
            // Reset form on success
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
        return <div className="flex justify-center items-center h-screen">Loading Profile...</div>;
    }

    return (
        <div className="">
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://res.cloudinary.com/dwykil2t4/image/upload/v1722874135/lms-frontend/Assets/undraw_mathematics_4otb_tqvxnt.png')" }}></div>
            <div className="container mx-auto p-4 md:p-8 -mt-52">
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Header with Avatar and User Info */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img 
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover" 
                                    src={avatarPreview || userData.avatar?.secureUrl || '/default-avatar.png'} 
                                    alt="Profile" 
                                />
                                {isEditMode && activeTab === 'profile' && (
                                    <>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={fileInputRef} 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current.click()} 
                                            className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600"
                                        >
                                            <FiCamera />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{userData.name}</h1>
                                <p className="text-gray-500">{userData.email}</p>
                                <p className="text-sm text-gray-400 capitalize">{userData.role}</p>
                            </div>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b mb-6">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-1 border-b-2 font-semibold ${
                                    activeTab === 'profile' 
                                        ? 'border-orange-500 text-orange-500' 
                                        : 'border-transparent text-gray-500 hover:border-gray-400'
                                }`}
                            >
                                Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`py-4 px-1 border-b-2 font-semibold flex items-center space-x-2 ${
                                    activeTab === 'security' 
                                        ? 'border-orange-500 text-orange-500' 
                                        : 'border-transparent text-gray-500 hover:border-gray-400'
                                }`}
                            >
                                <FiLock />
                                <span>Security</span>
                            </button>
                        </nav>
                    </div>

                    {/* Profile Tab Content */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleFormSubmit}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">Update your account details</h2>
                                {!isEditMode ? (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditMode(true)} 
                                        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex space-x-4">
                                        <button 
                                            type="button" 
                                            onClick={handleCancel} 
                                            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <InputField label="Full Name" name="name" value={formData.name || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                <SelectField label="Gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} disabled={!isEditMode} options={['Male', 'Female', 'Other']} />
                                <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                <InputField label="Email" name="email" value={userData.email} disabled />
                                <InputField label="State" name="address.state" value={formData.address?.state || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                <InputField label="City" name="address.city" value={formData.address?.city || ''} onChange={handleInputChange} disabled={!isEditMode} />
                                <InputField label="Pincode" name="address.pincode" value={formData.address?.pincode || ''} onChange={handleInputChange} disabled={!isEditMode} />
                            </div>
                        </form>
                    )}

                    {/* Security Tab Content */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-6">Password & Security</h2>
                            
                            <form onSubmit={handlePasswordSubmit} className="max-w-md">
                                {/* Current Password */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.oldPassword ? "text" : "password"}
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            disabled={loading}
                                            className="w-full border-b py-2 bg-transparent focus:outline-none focus:border-orange-500 pr-10"
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility('oldPassword')}
                                            disabled={loading}
                                        >
                                            {showPasswords.oldPassword ? <FiEyeOff className="h-4 w-4 text-gray-500" /> : <FiEye className="h-4 w-4 text-gray-500" />}
                                        </button>
                                    </div>
                                    {passwordErrors.oldPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.oldPassword}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.newPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            disabled={loading}
                                            className="w-full border-b py-2 bg-transparent focus:outline-none focus:border-orange-500 pr-10"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                            disabled={loading}
                                        >
                                            {showPasswords.newPassword ? <FiEyeOff className="h-4 w-4 text-gray-500" /> : <FiEye className="h-4 w-4 text-gray-500" />}
                                        </button>
                                    </div>
                                    {passwordErrors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            disabled={loading}
                                            className="w-full border-b py-2 bg-transparent focus:outline-none focus:border-orange-500 pr-10"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            disabled={loading}
                                        >
                                            {showPasswords.confirmPassword ? <FiEyeOff className="h-4 w-4 text-gray-500" /> : <FiEye className="h-4 w-4 text-gray-500" />}
                                        </button>
                                    </div>
                                    {passwordErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="mb-6 text-xs text-gray-500">
                                    <p className="mb-2">Password requirements:</p>
                                    <ul className="space-y-1">
                                        <li className={`flex items-center ${passwordData.newPassword.length >= 6 ? 'text-green-500' : 'text-red-500'}`}>
                                            <span className="mr-2">{passwordData.newPassword.length >= 6 ? "✓" : "✗"}</span>
                                            At least 6 characters long
                                        </li>
                                        <li className={`flex items-center ${passwordData.oldPassword && passwordData.newPassword && passwordData.oldPassword !== passwordData.newPassword ? 'text-green-500' : 'text-red-500'}`}>
                                            <span className="mr-2">{passwordData.oldPassword && passwordData.newPassword && passwordData.oldPassword !== passwordData.newPassword ? "✓" : "✗"}</span>
                                            Different from current password
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Changing Password...' : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper components (unchanged)
const InputField = ({ label, disabled, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} disabled={disabled} className="mt-1 block w-full border-b py-2 bg-transparent disabled:text-gray-500 disabled:bg-gray-100 focus:outline-none focus:border-orange-500" />
    </div>
);

const SelectField = ({ label, options, disabled, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select {...props} disabled={disabled} className="mt-1 block w-full border-b py-2 bg-transparent disabled:text-gray-500 disabled:bg-gray-100 focus:outline-none focus:border-orange-500">
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default ProfilePage;