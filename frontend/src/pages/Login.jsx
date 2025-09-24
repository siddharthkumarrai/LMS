import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice.ts';
import axiosInstance from '../Helpers/axiosInstance';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { useOAuth, OAUTH_PROVIDERS } from '../hooks/useOAuth.jsx';

// Keep your existing constants
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

// Validation helper (keep existing)
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

  // Get redirect path from location state or default
  const from = location.state?.from?.pathname || '/';

  // Initialize OAuth hook
  const { openOAuthPopup, isPopupOpen, isPopupLoading } = useOAuth({
    onSuccess: ({ token, user, provider }) => {
      console.log(`Successfully logged in with ${provider}`);
    },
    onError: ({ error, errorType, provider }) => {
      console.log(`OAuth error with ${provider}:`, error);
    },
    redirectPath: from,
    rememberMe: true
  });

  // Keep all your existing state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Keep all your existing form logic
  const hasErrors = useMemo(() =>
    Object.values(errors).some(error => error !== ''),
    [errors]
  );

  const isFormValid = useMemo(() => {
    const hasRequiredFields = formData.email && formData.password;
    return hasRequiredFields && !hasErrors;
  }, [formData, hasErrors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(VALIDATION_RULES).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    return newErrors;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name] && errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, errors]);

  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleRememberMe = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  // Keep your existing form submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({ email: true, password: true });
    const validationErrors = validateForm();
    setErrors(validationErrors);

    const errorMessages = Object.values(validationErrors).filter(Boolean);
    if (errorMessages.length > 0) {
      toast.error(errorMessages[0]);
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axiosInstance.post('/user/login', {
        email: formData.email.trim(),
        password: formData.password,
        rememberMe
      });

      const { success, token, user, message } = response?.data || {};

      if (success && token && user) {
        toast.dismiss(loadingToast);
        toast.success('Login successful!');
        dispatch(login({ token, ...user, rememberMe }));
        const redirectPath = user.role === 'admin' ? '/dashboard' : from;
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(message || 'Invalid credentials');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error?.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplified OAuth handler using the hook
  const handleOAuthLogin = useCallback((provider) => {
    if (isSubmitting || isPopupLoading || isPopupOpen()) return;
    openOAuthPopup(provider);
  }, [isSubmitting, isPopupLoading, isPopupOpen, openOAuthPopup]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isSubmitting && isFormValid) {
      handleSubmit(e);
    }
  }, [isSubmitting, isFormValid, handleSubmit]);

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-28">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
          Welcome Back
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center mx-auto">
          Sign in to your account to continue your journey
        </p>

        <form className="my-8" onSubmit={handleSubmit} onKeyPress={handleKeyPress} noValidate>
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
            />
            {errors.email && touched.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
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
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </LabelInputContainer>

          {/* Remember me and forgot password */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                disabled={isSubmitting}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            className={cn(
              "group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white transition-all duration-300",
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
            )}
            type="submit"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in →'}
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

          {/* OAuth Buttons */}
          <div className="flex flex-col space-y-3">
            {Object.values(OAUTH_PROVIDERS).map(( provider) => (
              <button
                key={provider.id}
                className={cn(
                  "group/btn relative flex h-12 w-full items-center justify-center space-x-2 rounded-md px-4 font-medium text-white transition-all duration-300",
                  provider.color,
                  (isPopupLoading || isSubmitting) ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
                )}
                type="button"
                onClick={() => handleOAuthLogin(provider.id)}
                disabled={isSubmitting || isPopupLoading}
                aria-label={`Continue with ${provider.displayName}`}
              >
                {isPopupLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Authenticating...</span>
                  </>
                ) : (
                  <>
                    {provider.icon}
                    <span className="text-sm">Continue with {provider.displayName}</span>
                  </>
                )}
                <BottomGradient />
              </button>
            ))}
          </div>

          {/* Signup link */}
          <p className="text-center mt-8 text-sm text-neutral-600 dark:text-neutral-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Create one here
            </Link>
          </p>

          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <span>🔒 Secured with 256-bit encryption</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// Keep your existing components
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

export default Login;