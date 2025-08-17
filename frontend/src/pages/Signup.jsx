import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice.ts';
import axiosInstance from '../Helpers/axiosInstance';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

// Constants
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 4,
    pattern: /^[a-zA-Z\s]+$/,
    messages: {
      required: 'Name is required',
      minLength: 'Name must be at least 4 characters long',
      pattern: 'Name should only contain letters and spaces'
    }
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address'
    }
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    messages: {
      required: 'Password is required',
      minLength: 'Password must be at least 6 characters long',
      pattern: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
  },
  avatar: {
    required: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    messages: {
      required: 'Profile picture is required',
      maxSize: 'Image size should be less than 5MB',
      type: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    }
  }
};

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  avatar: null
};

// Validation helper functions
const validateField = (name, value, file = null) => {
  const rules = VALIDATION_RULES[name];
  if (!rules) return '';

  // Required validation
  if (rules.required && !value && !file) {
    return rules.messages.required;
  }

  // File-specific validations
  if (name === 'avatar' && file) {
    if (rules.maxSize && file.size > rules.maxSize) {
      return rules.messages.maxSize;
    }
    if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
      return rules.messages.type;
    }
    return '';
  }

  // Text field validations
  if (value && typeof value === 'string') {
    const trimmedValue = value.trim();
    
    if (rules.minLength && trimmedValue.length < rules.minLength) {
      return rules.messages.minLength;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.messages.pattern;
    }
  }

  return '';
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized values
  const isAdminRegistration = useMemo(() => 
    location.pathname.includes('/instructor'), 
    [location.pathname]
  );

  const apiEndpoint = useMemo(() => 
    isAdminRegistration ? '/user/register/admin' : '/user/register',
    [isAdminRegistration]
  );

  const hasErrors = useMemo(() => 
    Object.values(errors).some(error => error !== ''),
    [errors]
  );

  const isFormValid = useMemo(() => {
    const hasAllRequiredFields = formData.name && formData.email && 
                                  formData.password && formData.avatar;
    return hasAllRequiredFields && !hasErrors;
  }, [formData, hasErrors]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(VALIDATION_RULES).forEach(field => {
      if (field === 'avatar') {
        newErrors[field] = validateField(field, null, formData[field]);
      } else {
        newErrors[field] = validateField(field, formData[field]);
      }
    });

    return newErrors;
  }, [formData]);

  // Handle text input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched]);

  // Handle input blur for validation
  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file
    const error = validateField('avatar', null, file);
    
    if (error) {
      setErrors(prev => ({ ...prev, avatar: error }));
      toast.error(error);
      e.target.value = ''; // Reset input
      return;
    }

    // Clear error if validation passes
    setErrors(prev => ({ ...prev, avatar: '' }));
    setFormData(prev => ({ ...prev, avatar: file }));

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      avatar: true
    });

    // Validate form
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Check for errors
    const errorMessages = Object.values(validationErrors).filter(Boolean);
    if (errorMessages.length > 0) {
      toast.error(errorMessages[0]);
      return;
    }

    // Prepare form data
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    // Submit form
    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating account...');

    try {
      const response = await axiosInstance.post(apiEndpoint, formDataToSend);
      const { success, token, user, message } = response?.data || {};

      if (success && token && user) {
        toast.dismiss(loadingToast);
        toast.success('Account created successfully!');
        
        // Dispatch login action
        dispatch(login({ token, ...user }));
        
        // Navigate to home
        navigate('/');
      } else {
        throw new Error(message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Something went wrong. Please try again.';
      
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: 'Email already exists' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setPreviewImage('');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[90vh] py-24">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
          Create Your Account
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
          Join us today and start your journey with our platform
        </p>

        <form className="my-8" onSubmit={handleSubmit} noValidate>
          {/* Avatar Upload Section */}
          <div className="mb-6 flex flex-col items-center">
            <Label htmlFor="image_uploads" className="mb-2">
              Profile Picture *
            </Label>
            <div className="relative">
              <label 
                htmlFor="image_uploads" 
                className="cursor-pointer group block"
                aria-label="Upload profile picture"
              >
                {previewImage ? (
                  <div className={cn(
                    "relative w-24 h-24 rounded-full overflow-hidden border-2 transition-colors duration-300",
                    errors.avatar && touched.avatar 
                      ? 'border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-500'
                  )}>
                    <img
                      className="w-full h-full object-cover"
                      src={previewImage}
                      alt="Profile preview"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-2 border-dashed transition-colors duration-300",
                    errors.avatar && touched.avatar
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-500'
                  )}>
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto mb-1 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                        Upload
                      </p>
                    </div>
                  </div>
                )}
              </label>
              <input
                onChange={handleImageUpload}
                className="hidden"
                type="file"
                id="image_uploads"
                name="image_uploads"
                accept="image/*"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {previewImage ? 'Click to change your profile picture' : 'Click to upload your profile picture'}
            </p>
            {errors.avatar && touched.avatar && (
              <p className="text-xs text-red-500 mt-1 text-center" role="alert">
                {errors.avatar}
              </p>
            )}
          </div>

          {/* Name Input */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={cn(
                errors.name && touched.name && 'border-red-500 focus:border-red-500'
              )}
              disabled={isSubmitting}
              aria-invalid={!!(errors.name && touched.name)}
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
            />
            {errors.name && touched.name && (
              <p id="name-error" className="text-xs text-red-500 mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </LabelInputContainer>

          {/* Email Input */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={cn(
                errors.email && touched.email && 'border-red-500 focus:border-red-500'
              )}
              disabled={isSubmitting}
              aria-invalid={!!(errors.email && touched.email)}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            />
            {errors.email && touched.email && (
              <p id="email-error" className="text-xs text-red-500 mt-1" role="alert">
                {errors.email}
              </p>
            )}
          </LabelInputContainer>

          {/* Password Input */}
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              placeholder="Create a secure password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={cn(
                errors.password && touched.password && 'border-red-500 focus:border-red-500'
              )}
              disabled={isSubmitting}
              aria-invalid={!!(errors.password && touched.password)}
              aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
            />
            {errors.password && touched.password && (
              <p id="password-error" className="text-xs text-red-500 mt-1" role="alert">
                {errors.password}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Must contain uppercase, lowercase, and number
            </p>
          </LabelInputContainer>

          {/* Submit Button */}
          <button
            className={cn(
              "group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-300",
              isSubmitting 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:scale-[1.02]"
            )}
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              <>Create Account &rarr;</>
            )}
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
  );
};

// Bottom Gradient Component
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

// Label Input Container Component
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default Signup;