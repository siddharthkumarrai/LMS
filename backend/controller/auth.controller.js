import UserModel from "../models/user.model.js";
import AppError from "../utils/error.util.js";

// Google OAuth success callback
export const googleAuthSuccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError("Authentication failed", 401));
        }

        const user = req.user;
        const token = user.generateJwtToken();

        // Set cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + (60 * 60 * 24 * 1000)), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        // Instead of redirecting to dashboard, create a success page that communicates with parent
        const successPageHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Success</title>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                h2 { margin: 0 0 1rem; }
                p { margin: 0; opacity: 0.9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="spinner"></div>
                <h2>Authentication Successful!</h2>
                <p>You can close this window now.</p>
            </div>
            <script>
                // Send success message to parent window
                const authData = {
                    success: true,
                    token: "${token}",
                    user: ${JSON.stringify({
                        id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        role: user.role,
                        avatar: user.avatar,
                        isEmailVerified: user.isEmailVerified
                    })}
                };
                
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_SUCCESS',
                        data: authData
                    }, '${process.env.FRONTEND_URL}');
                }
                
                // Close popup after a short delay
                setTimeout(() => {
                    window.close();
                }, 1500);
            </script>
        </body>
        </html>
        `;

        res.send(successPageHtml);

    } catch (error) {
        console.error('Google auth success error:', error);
        
        const errorPageHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Failed</title>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                .error-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                h2 { margin: 0 0 1rem; }
                p { margin: 0; opacity: 0.9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">⚠️</div>
                <h2>Authentication Failed</h2>
                <p>Please try again or contact support.</p>
            </div>
            <script>
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_ERROR',
                        error: 'Authentication failed'
                    }, '${process.env.FRONTEND_URL}');
                }
                
                setTimeout(() => {
                    window.close();
                }, 3000);
            </script>
        </body>
        </html>
        `;
        
        res.send(errorPageHtml);
    }
};

// GitHub OAuth success callback
export const githubAuthSuccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError("Authentication failed", 401));
        }

        const user = req.user;
        const token = user.generateJwtToken();

        // Set cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + (60 * 60 * 24 * 1000)), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        // Same success page as Google auth
        const successPageHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Success</title>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #24292e 0%, #1a1e22 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                h2 { margin: 0 0 1rem; }
                p { margin: 0; opacity: 0.9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="spinner"></div>
                <h2>Authentication Successful!</h2>
                <p>You can close this window now.</p>
            </div>
            <script>
                // Send success message to parent window
                const authData = {
                    success: true,
                    token: "${token}",
                    user: ${JSON.stringify({
                        id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        role: user.role,
                        avatar: user.avatar,
                        isEmailVerified: user.isEmailVerified
                    })}
                };
                
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_SUCCESS',
                        data: authData
                    }, '${process.env.FRONTEND_URL}');
                }
                
                // Close popup after a short delay
                setTimeout(() => {
                    window.close();
                }, 1500);
            </script>
        </body>
        </html>
        `;

        res.send(successPageHtml);

    } catch (error) {
        console.error('GitHub auth success error:', error);
        
        const errorPageHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Failed</title>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                .error-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                h2 { margin: 0 0 1rem; }
                p { margin: 0; opacity: 0.9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">⚠️</div>
                <h2>Authentication Failed</h2>
                <p>Please try again or contact support.</p>
            </div>
            <script>
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_ERROR',
                        error: 'Authentication failed'
                    }, '${process.env.FRONTEND_URL}');
                }
                
                setTimeout(() => {
                    window.close();
                }, 3000);
            </script>
        </body>
        </html>
        `;
        
        res.send(errorPageHtml);
    }
};

// OAuth failure callback
export const oauthFailure = (req, res) => {
    // Get error details from query params or session
    const errorType = req.query.error || req.session?.authError || 'unknown_error';
    const errorDescription = req.query.error_description || 'Authentication failed';
    const provider = req.query.provider || req.params.provider || 'OAuth';
    
    // Clear any session error
    if (req.session?.authError) {
        delete req.session.authError;
    }

    // Map error types to user-friendly messages
    const getErrorMessage = (errorType, provider) => {
        const errorMessages = {
            'access_denied': `You cancelled the ${provider} login. Please try again if you want to continue.`,
            'unauthorized_client': `There's an issue with our ${provider} integration. Please try again later.`,
            'invalid_request': `Authentication request failed. Please try again.`,
            'invalid_client': `Authentication service temporarily unavailable. Please try again later.`,
            'invalid_grant': `Authentication expired. Please try again.`,
            'unsupported_response_type': `Authentication method not supported. Please try a different method.`,
            'invalid_scope': `Insufficient permissions granted. Please try again and allow required permissions.`,
            'server_error': `${provider} authentication server error. Please try again later.`,
            'temporarily_unavailable': `${provider} service is temporarily unavailable. Please try again later.`,
            'rate_limit_exceeded': `Too many authentication attempts. Please wait a moment and try again.`,
            'account_selection_required': `Please select an account and try again.`,
            'login_required': `Please log in to your ${provider} account first.`,
            'consent_required': `Please grant the required permissions and try again.`,
            'unknown_error': `Authentication failed. Please try again.`
        };

        return errorMessages[errorType] || errorMessages['unknown_error'];
    };

    const userMessage = getErrorMessage(errorType, provider);
    const showRetryButton = !['access_denied', 'rate_limit_exceeded'].includes(errorType);

    const errorPageHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Authentication Failed</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
                color: white;
                padding: 1rem;
            }

            .container {
                text-align: center;
                padding: 2rem;
                max-width: 400px;
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 1rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .error-icon {
                font-size: 4rem;
                margin-bottom: 1.5rem;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            }

            h2 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .error-message {
                font-size: 0.95rem;
                line-height: 1.5;
                margin-bottom: 2rem;
                opacity: 0.95;
                padding: 0 1rem;
            }

            .error-code {
                font-size: 0.8rem;
                opacity: 0.7;
                margin-bottom: 1.5rem;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                background: rgba(0, 0, 0, 0.2);
                padding: 0.5rem;
                border-radius: 0.25rem;
                word-break: break-all;
            }

            .actions {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-top: 1.5rem;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 0.5rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
                text-decoration: none;
                display: inline-block;
            }

            .btn-primary {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-primary:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: transparent;
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .countdown {
                font-size: 0.8rem;
                opacity: 0.7;
                margin-top: 1rem;
            }

            @media (max-width: 480px) {
                .container {
                    padding: 1.5rem;
                    margin: 1rem;
                }
                
                .error-icon {
                    font-size: 3rem;
                }
                
                h2 {
                    font-size: 1.25rem;
                }
            }

            /* Animation for error icon */
            .error-icon {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-icon">🚫</div>
            <h2>Authentication Failed</h2>
            <div class="error-message">${userMessage}</div>
            
            ${errorType !== 'unknown_error' ? `<div class="error-code">Error: ${errorType}</div>` : ''}
            
            <div class="actions">
                ${showRetryButton ? `
                <button class="btn btn-primary" onclick="retryAuth()">
                    Try Again
                </button>
                ` : ''}
                
                <button class="btn btn-secondary" onclick="closeWindow()">
                    Close Window
                </button>
            </div>
            
            <div class="countdown">
                Window will close automatically in <span id="countdown">10</span> seconds
            </div>
        </div>

        <script>
            let countdown = 10;
            const countdownElement = document.getElementById('countdown');
            
            // Send error message to parent window
            function notifyParent(errorData) {
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_ERROR',
                        error: '${userMessage}',
                        errorType: '${errorType}',
                        provider: '${provider}',
                        ...errorData
                    }, '${process.env.FRONTEND_URL}');
                }
            }

            // Retry authentication
            function retryAuth() {
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'OAUTH_RETRY',
                        provider: '${provider}'
                    }, '${process.env.FRONTEND_URL}');
                }
                window.close();
            }

            // Close window manually
            function closeWindow() {
                notifyParent({ userClosed: true });
                window.close();
            }

            // Countdown timer
            const timer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    notifyParent({ autoClose: true });
                    window.close();
                }
            }, 1000);

            // Send initial error notification
            notifyParent({ autoClose: false, userClosed: false });

            // Handle page unload
            window.addEventListener('beforeunload', () => {
                clearInterval(timer);
                notifyParent({ userClosed: true });
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeWindow();
                }
            });
        </script>
    </body>
    </html>
    `;
    
    res.send(errorPageHtml);
};

// Link OAuth account to existing account
export const linkOAuthAccount = async (req, res, next) => {
    try {
        const { provider, providerId } = req.body;
        const userId = req.user.id;

        if (!provider || !providerId) {
            return next(new AppError("Provider and provider ID are required", 400));
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        // Update user with OAuth info
        if (provider === 'google') {
            user.googleId = providerId;
        } else if (provider === 'github') {
            user.githubId = providerId;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `${provider} account linked successfully`,
            user
        });

    } catch (error) {
        return next(error);
    }
};

// Unlink OAuth account
export const unlinkOAuthAccount = async (req, res, next) => {
    try {
        const { provider } = req.body;
        const userId = req.user.id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        // Check if user has password or other auth method
        if (user.authProvider !== 'local' && !user.password) {
            // If this is the only auth method, don't allow unlinking
            const hasOtherAuth = (provider === 'google' && user.githubId) || 
                                (provider === 'github' && user.googleId);
            
            if (!hasOtherAuth) {
                return next(new AppError("Cannot unlink the only authentication method. Please set a password first.", 400));
            }
        }

        // Remove OAuth info
        if (provider === 'google') {
            user.googleId = undefined;
        } else if (provider === 'github') {
            user.githubId = undefined;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `${provider} account unlinked successfully`,
            user
        });

    } catch (error) {
        return next(error);
    }
};