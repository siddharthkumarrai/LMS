import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/features/auth/authSlice.ts';

/**
 * Optional component to handle authentication success redirects
 * This can be used if you want a dedicated success page instead of handling everything in popups
 */
const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Authentication failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      // You could decode the token to get user info
      // Or make an API call to get user details
      // For now, we'll assume the token contains the user info
      
      try {
        // Decode token or fetch user data
        // This is a placeholder - implement according to your token structure
        const userData = {
          // Extract from token or fetch from API
        };

        dispatch(login({ token, ...userData, rememberMe: true }));
        toast.success('Login successful!');
        
        // Redirect to dashboard or intended page
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Token processing error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    } else {
      // No token found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <h2 className="text-2xl font-semibold mt-4">Processing authentication...</h2>
        <p className="text-gray-600 mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;