import {Router} from "express";
import passport from "../config/passport.js";
import { 
    login, register, logout, forgotPassword, resetPassword, 
    changePassword, updateProfile, adminRegister, getMyProfile, 
    getEnrolledStudents 
} from "../controller/user.controller.js";
import { 
    googleAuthSuccess, githubAuthSuccess, oauthFailure,
    linkOAuthAccount, unlinkOAuthAccount 
} from "../controller/auth.controller.js";
import {authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.fileupload.middleware.js";

const userRoutes = Router();

// Existing routes
userRoutes.post("/register", upload.single('avatar'), register);
userRoutes.post("/login", login);
userRoutes.get("/me", isLoggedIn, getMyProfile);
userRoutes.get("/logout", isLoggedIn, logout);
userRoutes.post("/forgotpassword", forgotPassword);
userRoutes.post("/forgotpassword/:resetToken", resetPassword);
userRoutes.post("/change-password", isLoggedIn, changePassword);
userRoutes.put("/update-profile", isLoggedIn, upload.single('avatar'), updateProfile);

// ADMIN USER
userRoutes.post("/register/admin", upload.single('avatar'), adminRegister);
userRoutes.get('/enrollments', isLoggedIn, authorizedRoles('admin'), getEnrolledStudents);

// OAuth Routes
// Google OAuth
userRoutes.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRoutes.get('/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/api/v1/user/auth/failure',
        session: false 
    }),
    googleAuthSuccess
);

// GitHub OAuth
userRoutes.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

userRoutes.get('/auth/github/callback',
    passport.authenticate('github', { 
        failureRedirect: '/api/v1/user/auth/failure',
        session: false 
    }),
    githubAuthSuccess
);

// OAuth failure route
userRoutes.get('/auth/failure', oauthFailure);

// Link/Unlink OAuth accounts (for existing users)
userRoutes.post('/link-oauth', isLoggedIn, linkOAuthAccount);
userRoutes.post('/unlink-oauth', isLoggedIn, unlinkOAuthAccount);

export default userRoutes;