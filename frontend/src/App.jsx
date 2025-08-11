import { Routes, Route } from 'react-router';

// Layouts
import HomeLayout from './Layouts/HomeLayout';
import DashboardLayout from './Layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import CourseDetails from './pages/CourseDetails';

// NEW: Password Management Pages
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';

// Route Protection Components
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoute from './routes/AuthRoute';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import CoursePlayer from './pages/CoursePlayer';
import CreateCourse from './pages/CreateCourse';
import ProfilePage from './pages/ProfilePage';
import MyCoursesPage from './pages/MyCourses';
import ManageLectures from './pages/ManageLectures';
import AllCourses from './pages/AllCourses';
import EnrolledStudentsPage from './pages/EnrolledStudentsPage ';

function App() {
  return (
    <Routes>
      {/* 1. Public Routes (jinke upar Navbar chahiye) */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-courses" element={<AllCourses />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/checkout/:courseId" element={<CheckoutPage />} />
        <Route path='/checkout/success' element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/course/:courseId/player" element={<CoursePlayer />} />

        <Route element={<AuthRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/instructor" element={<Signup />} />
          
          {/* NEW: Password Management Routes - These should be public but redirected if logged in */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* 2. Protected Dashboard Routes (jinke upar Navbar nahi chahiye) */}
      <Route element={<ProtectedRoute allowedRoles={['admin','user']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          
          {/* NEW: Change Password Route - Only for logged in users */}
          <Route path="/change-password" element={<ChangePassword />} />
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/course/create" element={<CreateCourse />} />
            <Route path="/students" element={<EnrolledStudentsPage />} />
            <Route path="/course/manage-lectures/:courseId" element={<ManageLectures />} />
          </Route>
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;