import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice.ts';

// OAuth Providers Configuration
export const OAUTH_PROVIDERS = {
  google: {
    id: 'google',
    displayName: 'Google',
    color: 'bg-gray-900 hover:bg-gray-800',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )
  },
  github: {
    id: 'github',
    displayName: 'GitHub',
    color: 'bg-gray-900 hover:bg-gray-800',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  }
};

/**
 * Custom hook for handling OAuth authentication
 * @param {Object} options Configuration options
 * @param {Function} options.onSuccess Callback for successful authentication
 * @param {Function} options.onError Callback for authentication errors
 * @param {string} options.redirectPath Path to redirect after successful login
 * @param {boolean} options.rememberMe Whether to remember the user
 */
// OAuth utilities
export const oauthUtils = {
  getProvider: (providerId) => OAUTH_PROVIDERS[providerId],
  getAllProviders: () => Object.values(OAUTH_PROVIDERS),
  isValidProvider: (providerId) => !!OAUTH_PROVIDERS[providerId]
};

export const useOAuth = (options = {}) => {
  const {
    onSuccess,
    onError,
    redirectPath = '/',
    rememberMe = false
  } = options;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [isPopupLoading, setIsPopupLoading] = useState(false);

  // Refs
  const popupRef = useRef(null);
  const messageListenerRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check if popup is currently open
  const isPopupOpen = useCallback(() => {
    return popupRef.current && !popupRef.current.closed;
  }, []);

  // Handle messages from OAuth popup
  const handleOAuthMessage = useCallback((event) => {
    // Verify origin for security
    const expectedOrigin = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const baseOrigin = expectedOrigin.replace('/api/v1', '');
    
    if (event.origin !== baseOrigin) {
      console.warn('Received message from unexpected origin:', event.origin);
      return;
    }

    const { type, data, error, errorType, provider } = event.data;

    switch (type) {
      case 'OAUTH_SUCCESS': {
        const { token, user } = data;
        
        toast.success(`Successfully logged in with ${provider}!`);
        
        // Dispatch login action
        dispatch(login({ token, ...user, rememberMe }));
        
        // Call custom success handler if provided
        if (onSuccess) {
          onSuccess({ token, user, provider });
        }
        
        // Navigate based on user role
        const finalRedirectPath = user.role === 'admin' ? '/dashboard' : redirectPath;
        navigate(finalRedirectPath, { replace: true });
        
        // Clean up
        cleanup();
        break;
      }

      case 'OAUTH_ERROR': {
        // Show specific error message
        const errorMessage = error || 'Authentication failed. Please try again.';
        
        // Different toast types based on error type
        if (errorType === 'access_denied') {
          toast('Authentication cancelled', { icon: 'ℹ️' });
        } else if (errorType === 'rate_limit_exceeded') {
          toast.error('Too many attempts. Please wait before trying again.');
        } else {
          toast.error(errorMessage);
        }
        
        // Call custom error handler if provided
        if (onError) {
          onError({ error: errorMessage, errorType, provider });
        }
        
        // Clean up
        cleanup();
        break;
      }

      case 'OAUTH_RETRY': {
        // User clicked retry - close current popup and retry
        cleanup();
        
        // Small delay then retry
        setTimeout(() => {
          openOAuthPopup(provider);
        }, 500);
        break;
      }

      default:
        console.warn('Unknown OAuth message type:', type);
        break;
    }
  }, [dispatch, navigate, redirectPath, rememberMe, onSuccess, onError]);

  // Clean up popup and listeners
  const cleanup = useCallback(() => {
    setIsPopupLoading(false);

    // Close popup
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;

    // Remove message listener
    if (messageListenerRef.current) {
      window.removeEventListener('message', messageListenerRef.current);
      messageListenerRef.current = null;
    }

    // Clear intervals and timeouts
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Open OAuth popup
  const openOAuthPopup = useCallback((provider) => {
    // Prevent multiple popups
    if (isPopupLoading || isPopupOpen()) {
      console.warn('OAuth popup already open or loading');
      return;
    }

    // Validate provider
    if (!OAUTH_PROVIDERS[provider]) {
      toast.error('Invalid OAuth provider');
      return;
    }

    setIsPopupLoading(true);
    
    // Popup dimensions and positioning
    const width = 600;
    const height = 700;
    const left = Math.round((window.innerWidth / 2) - (width / 2));
    const top = Math.round((window.innerHeight / 2) - (height / 2));

    // Build auth URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const authUrl = `${baseUrl}/api/v1/user/auth/${provider}`;

    // Open popup
    popupRef.current = window.open(
      authUrl,
      `${provider}Auth`,
      `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`
    );

    // Check if popup was blocked
    if (!popupRef.current || popupRef.current.closed) {
      toast.error('Popup blocked! Please allow popups for this site.');
      setIsPopupLoading(false);
      return;
    }

    // Set up message listener
    messageListenerRef.current = handleOAuthMessage;
    window.addEventListener('message', messageListenerRef.current);

    // Monitor popup status
    checkIntervalRef.current = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        // Popup was closed manually
        cleanup();
        // Don't show error toast if user just closed the popup
      }
    }, 1000);

    // Auto-close after 5 minutes
    timeoutRef.current = setTimeout(() => {
      if (isPopupOpen()) {
        toast.error('Authentication timed out. Please try again.');
        cleanup();
      }
    }, 300000); // 5 minutes

  }, [isPopupLoading, isPopupOpen, handleOAuthMessage, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Return hook interface
  return {
    openOAuthPopup,
    isPopupOpen,
    isPopupLoading,
    cleanup
  };
};