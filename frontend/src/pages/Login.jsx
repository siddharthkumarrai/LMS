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
    messages: {
      required: 'Password is required',
      minLength: 'Password must be at least 6 characters long'
    }
  }
};

const INITIAL_FORM_STATE = {
  email: '',
  password: ''
};

const SOCIAL_PROVIDERS = [
  {
    id: 'google',
    name: 'Google',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: (
      <svg className="h-5 w-5 text-neutral-800 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
];

// Validation helper
const validateField = (name, value) => {
  const rules = VALIDATION_RULES[name];
  if (!rules) return '';

  const trimmedValue = value.trim();

  if (rules.required && !trimmedValue) {
    return rules.messages.required;
  }

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return rules.messages.minLength;
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return rules.messages.pattern;
  }

  return '';
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get redirect path from location state or default
  const from = location.state?.from?.pathname || '/';

  // Memoized values
  const hasErrors = useMemo(() => 
    Object.values(errors).some(error => error !== ''),
    [errors]
  );

  const isFormValid = useMemo(() => {
    const hasRequiredFields = formData.email && formData.password;
    return hasRequiredFields && !hasErrors;
  }, [formData, hasErrors]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(VALIDATION_RULES).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });

    return newErrors;
  }, [formData]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (touched[name] && errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, errors]);

  // Handle input blur
  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Handle remember me
  const handleRememberMe = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
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

    // Submit form
    setIsSubmitting(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axiosInstance.post('/user/login', {
        email: formData.email.trim(),
        password: formData.password,
        rememberMe // Send remember me preference
      });

      const { success, token, user, message } = response?.data || {};

      if (success && token && user) {
        toast.dismiss(loadingToast);
        toast.success('Login successful!');
        
        // Dispatch login action
        dispatch(login({ token, ...user, rememberMe }));
        
        // Navigate based on user role
        const redirectPath = user.role === 'admin' ? '/dashboard' : from;
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(message || 'Invalid credentials');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const status = error.response?.status;
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (status === 401) {
        errorMessage = 'Invalid email or password';
        setErrors(prev => ({ 
          ...prev, 
          email: ' ',
          password: 'Invalid credentials' 
        }));
      } else if (status === 403) {
        errorMessage = 'Your account has been disabled. Please contact support.';
      } else if (status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social login
  const handleSocialLogin = useCallback((provider) => {
    toast.info(`${provider} login coming soon!`);
    // In production, you would redirect to OAuth endpoint
    // window.location.href = `/api/auth/${provider}`;
  }, []);

  // Handle key press (Enter to submit)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isSubmitting && isFormValid) {
      handleSubmit(e);
    }
  }, [isSubmitting, isFormValid]);

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-28">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
          Welcome Back
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
          Sign in to your account to continue your journey
        </p>

        <form 
          className="my-8" 
          onSubmit={handleSubmit} 
          onKeyPress={handleKeyPress}
          noValidate
        >
          {/* Email Input */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
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
              autoComplete="email"
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
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={cn(
                  'pr-10',
                  errors.password && touched.password && 'border-red-500 focus:border-red-500'
                )}
                disabled={isSubmitting}
                autoComplete="current-password"
                aria-invalid={!!(errors.password && touched.password)}
                aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <p id="password-error" className="text-xs text-red-500 mt-1" role="alert">
                {errors.password}
              </p>
            )}
          </LabelInputContainer>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                disabled={isSubmitting}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
              tabIndex={isSubmitting ? -1 : 0}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            className={cn(
              "group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-300",
              isSubmitting 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:scale-[1.02]"
            )}
            type="submit"
            disabled={isSubmitting || !isFormValid}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>Sign in &rarr;</>
            )}
            <BottomGradient />
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-black dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col space-y-3">
            {SOCIAL_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                className="group/btn shadow-input relative flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100 dark:hover:bg-zinc-800"
                type="button"
                onClick={() => handleSocialLogin(provider.name)}
                disabled={isSubmitting}
                aria-label={`Continue with ${provider.name}`}
              >
                {provider.icon}
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Continue with {provider.name}
                </span>
                <BottomGradient />
              </button>
            ))}
          </div>

          {/* Signup Link */}
          <p className="text-center mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
              tabIndex={isSubmitting ? -1 : 0}
            >
              Create one here
            </Link>
          </p>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured with 256-bit encryption</span>
          </div>
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

export default Login;