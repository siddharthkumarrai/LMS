import React, { useState } from 'react';
import { useOAuth, OAUTH_PROVIDERS, oauthUtils } from './useOAuth';
import { cn } from '../lib/utils';

/**
 * Reusable OAuth button component
 * Handles the OAuth flow with loading states and error handling
 */
const OAuthButton = ({
  provider,
  className = '',
  size = 'default',
  variant = 'default',
  disabled = false,
  onSuccess,
  onError,
  children,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openOAuthPopup } = useOAuth({
    onSuccess: (data) => {
      setIsLoading(false);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      setIsLoading(false);
      if (onError) onError(error);
    }
  });

  const providerConfig = oauthUtils.getProvider(provider);

  if (!providerConfig) {
    console.error(`Invalid OAuth provider: ${provider}`);
    return null;
  }

  const handleClick = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    const success = openOAuthPopup(provider);
    
    if (!success) {
      setIsLoading(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-12 px-4',
    lg: 'h-14 px-6 text-lg'
  };

  // Style variants
  const variantClasses = {
    default: providerConfig.color,
    outline: `border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200`,
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-200'
  };

  const buttonClasses = cn(
    "group/btn relative flex w-full items-center justify-center gap-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant],
    (isLoading || disabled) ? "cursor-not-allowed" : "hover:scale-[1.02]",
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={isLoading || disabled}
      aria-label={`Continue with ${providerConfig.displayName}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Authenticating...</span>
        </>
      ) : (
        <>
          {providerConfig.icon}
          <span>
            {children || `Continue with ${providerConfig.displayName}`}
          </span>
        </>
      )}
      
      {/* Bottom gradient effect */}
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </button>
  );
};

/**
 * OAuth button group component
 * Renders multiple OAuth provider buttons
 */
export const OAuthButtonGroup = ({
  providers = ['google', 'github'],
  className = '',
  buttonClassName = '',
  size = 'default',
  variant = 'default',
  orientation = 'vertical',
  onSuccess,
  onError,
  disabled = false
}) => {
  const containerClasses = cn(
    "flex",
    orientation === 'vertical' ? "flex-col space-y-3" : "flex-row space-x-3",
    className
  );

  return (
    <div className={containerClasses}>
      {providers.map((provider) => (
        <OAuthButton
          key={provider}
          provider={provider}
          className={buttonClassName}
          size={size}
          variant={variant}
          disabled={disabled}
          onSuccess={onSuccess}
          onError={onError}
        />
      ))}
    </div>
  );
};

/**
 * OAuth divider component
 * Shows "Or continue with" text with horizontal line
 */
export const OAuthDivider = ({ 
  text = "Or continue with",
  className = ""
}) => {
  return (
    <div className={cn("relative my-8", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500 dark:bg-black dark:text-gray-400">
          {text}
        </span>
      </div>
    </div>
  );
};

// Example usage component
export const OAuthExample = () => {
  const handleSuccess = (data) => {
    console.log('OAuth success:', data);
  };

  const handleError = (error) => {
    console.error('OAuth error:', error);
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h2 className="text-xl font-bold text-center">OAuth Examples</h2>
      
      {/* Single buttons */}
      <div className="space-y-3">
        <OAuthButton
          provider="google"
          onSuccess={handleSuccess}
          onError={handleError}
        />
        
        <OAuthButton
          provider="github"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>

      <OAuthDivider />

      {/* Button group */}
      <OAuthButtonGroup
        providers={['google', 'github']}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <OAuthDivider text="Or try different variants" />

      {/* Different variants */}
      <div className="space-y-3">
        <OAuthButton
          provider="google"
          variant="outline"
          size="sm"
          onSuccess={handleSuccess}
          onError={handleError}
        >
          Small Outline Button
        </OAuthButton>
        
        <OAuthButton
          provider="github"
          variant="ghost"
          size="lg"
          onSuccess={handleSuccess}
          onError={handleError}
        >
          Large Ghost Button
        </OAuthButton>
      </div>

      {/* Horizontal layout */}
      <OAuthButtonGroup
        providers={['google', 'github']}
        orientation="horizontal"
        size="sm"
        variant="outline"
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default OAuthButton;