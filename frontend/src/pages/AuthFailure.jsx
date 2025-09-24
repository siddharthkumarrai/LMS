import { useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice';

/**
 * Custom hook for handling OAuth authentication flows
 * Provides a clean interface for OAuth popup management and message handling
 */
export const useOAuth = ({ 
  onSuccess, 
  onError, 
  redirectPath = '/dashboard',
  rememberMe = true 
} = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const messageListenerRef = useRef(null);

  // Clean up popup and listeners on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      if (messageListenerRef.current) {
        window.removeEventListener('message', messageListenerRef.current);
      }
    };
  }, []);

  // Handle OAuth popup messages
  const handleOAuthMessage = useCallback((event) => {
    // Verify origin for security
    const expectedOrigin = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    if (event.origin !== expectedOrigin.replace('/api/v1', '')) {
      console.warn('OAuth message from unexpected origin:', event.origin);
      return;
    }

    const { type, data, error, errorType, provider } = event.data;

    switch (type) {
      case 'OAUTH_SUCCESS':
        const { token, user } = data;
        
        // Show success message
        toast.success('Login successful!');
        
        // Dispatch login action
        dispatch(login({ token, ...user, rememberMe }));
        
        // Call custom success handler if provided
        if (onSuccess) {
          onSuccess({ token, user, provider });
        } else {
          // Default navigation logic
          const finalRedirectPath = user.role === 'admin' ? '/dashboard' : redirectPath;
          navigate(finalRedirectPath, { replace: true });
        }
        
        // Close popup
        if (popupRef.current) {
          popupRef.current.close();
        }
        break;

      case 'OAUTH_ERROR':
        // Show specific error message from the failure page
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
        
        // Close popup
        if (popupRef.current) {
          popupRef.current.close();
        }
        break;

      case 'OAUTH_RETRY':
        // User clicked retry in the error popup - close current popup and retry
        if (popupRef.current) {
          popupRef.current.close();
        }
        
        // Small delay then retry
        setTimeout(() => {
          openOAuthPopup(provider);
        }, 500);
        break;

      default:
        console.warn('Unknown OAuth message type:', type);
        break;
    }
  }, [dispatch, navigate, redirectPath, rememberMe, onSuccess, onError]);

  // Open OAuth popup window
  const openOAuthPopup = useCallback((provider) => {
    // Close existing popup if any
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    // Create popup window
    const width = 600;
    const height = 700;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    const authUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/user/auth/${provider}`;

    popupRef.current = window.open(
      authUrl,
      `${provider}Auth`,
      `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`
    );

    // Set up message listener
    messageListenerRef.current = handleOAuthMessage;
    window.addEventListener('message', messageListenerRef.current);

    // Check if popup was blocked
    if (!popupRef.current || popupRef.current.closed) {
      toast.error('Popup blocked! Please allow popups for this site.');
      return false;
    }

    // Monitor popup status
    const checkPopup = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        clearInterval(checkPopup);
        window.removeEventListener('message', messageListenerRef.current);
      }
    }, 1000);

    // Auto-close after 5 minutes
    setTimeout(() => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
        toast.error('Authentication timed out. Please try again.');
      }
      clearInterval(checkPopup);
      window.removeEventListener('message', messageListenerRef.current);
    }, 300000);

    return true;
  }, [handleOAuthMessage]);

  // Close popup manually
  const closePopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    if (messageListenerRef.current) {
      window.removeEventListener('message', messageListenerRef.current);
    }
  }, []);

  // Check if popup is currently open
  const isPopupOpen = useCallback(() => {
    return popupRef.current && !popupRef.current.closed;
  }, []);

  return {
    openOAuthPopup,
    closePopup,
    isPopupOpen
  };
};

/**
 * Higher-order component that provides OAuth functionality
 * Usage: const EnhancedComponent = withOAuth(MyComponent);
 */
export const withOAuth = (WrappedComponent) => {
  return function WithOAuthComponent(props) {
    const oauth = useOAuth(props.oauthConfig);
    
    return (
      <WrappedComponent
        {...props}
        oauth={oauth}
      />
    );
  };
};

/**
 * OAuth configuration constants
 */
export const OAUTH_PROVIDERS = {
  GOOGLE: {
    id: 'google',
    name: 'Google',
    displayName: 'Google',
    color: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-white',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )
  },
  GITHUB: {
    id: 'github',
    name: 'GitHub',
    displayName: 'GitHub',
    color: 'bg-gray-800 hover:bg-gray-900',
    textColor: 'text-white',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  },
  FACEBOOK: {
    id: 'facebook',
    name: 'Facebook',
    displayName: 'Facebook',
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  TWITTER: {
    id: 'twitter',
    name: 'Twitter',
    displayName: 'X (Twitter)',
    color: 'bg-black hover:bg-gray-800',
    textColor: 'text-white',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }
};

/**
 * Utility functions for OAuth
 */
export const oauthUtils = {
  // Get provider configuration
  getProvider: (providerId) => {
    const provider = Object.values(OAUTH_PROVIDERS).find(p => p.id === providerId);
    if (!provider) {
      console.warn(`Unknown OAuth provider: ${providerId}`);
      return null;
    }
    return provider;
  },

  // Get all available providers
  getAvailableProviders: () => {
    return Object.values(OAUTH_PROVIDERS);
  },

  // Check if a provider is available
  isProviderAvailable: (providerId) => {
    return Object.values(OAUTH_PROVIDERS).some(p => p.id === providerId);
  },

  // Format provider display name
  formatProviderName: (providerId) => {
    const provider = oauthUtils.getProvider(providerId);
    return provider ? provider.displayName : providerId;
  }
};

export default useOAuth;