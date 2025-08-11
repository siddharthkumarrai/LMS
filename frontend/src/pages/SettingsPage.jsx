import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { FiUser, FiLock, FiCamera } from 'react-icons/fi';

// =================================================================
// Sub-Component 1: Profile Edit Karne ka Form
// =================================================================
const EditProfileForm = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);

    const [formData, setFormData] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData(userData);
            setAvatarPreview(userData.avatar?.secureUrl || '');
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = new FormData();
        dataToSubmit.append('name', formData.name);
        if (avatarFile) {
            dataToSubmit.append('avatar', avatarFile);
        }
        dispatch(updateProfile(dataToSubmit));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                            <FiCamera />
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700" />
                </div>
                {/* Yahan aap Gender, Contact Number, etc. ke liye aur fields add kar sakte hain */}
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700">Save Changes</button>
            </form>
        </div>
    );
};

// =================================================================
// Sub-Component 2: Password Change Karne ka Form
// =================================================================
const ChangePasswordForm = () => {
    const dispatch = useDispatch();
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New password and confirm password do not match!");
        }
        if (passwords.newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters long.");
        }
        dispatch(changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }));
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Old Password</label>
                    <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700">Update Password</button>
            </form>
        </div>
    );
};


// =================================================================
// Main Settings Page Component
// =================================================================
const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <EditProfileForm />;
            case 'password':
                return <ChangePasswordForm />;
            default:
                return <EditProfileForm />;
        }
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 w-full p-3 text-left rounded-md transition-colors ${
                activeTab === id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Account Settings</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar (Tabs) */}
                    <aside className="w-full md:w-1/4">
                        <nav className="space-y-2">
                            <TabButton id="profile" label="Edit Profile" icon={<FiUser />} />
                            <TabButton id="password" label="Change Password" icon={<FiLock />} />
                        </nav>
                    </aside>

                    {/* Right Content */}
                    <main className="flex-1 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;