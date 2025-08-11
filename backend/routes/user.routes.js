import {Router} from "express";
import { login, register, logout, forgotPassword, resetPassword, changePassword, updateProfile, adminRegister, getMyProfile, getEnrolledStudents } from "../controller/user.controller.js";
import {authorizedRoles, isLoggedIn }from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.fileupload.middleware.js";

const userRoutes = Router();

userRoutes.post("/register", upload.single('avatar'),register);
userRoutes.post("/login",login);
userRoutes.get("/me",isLoggedIn,getMyProfile);
userRoutes.get("/logout",isLoggedIn,logout);
userRoutes.post("/forgotpassword",forgotPassword);
userRoutes.post("/forgotpassword/:resetToken", resetPassword);
userRoutes.post("/change-password",isLoggedIn,changePassword)
userRoutes.put("/update-profile",isLoggedIn,upload.single('avatar'),updateProfile)

// ADMIN USER
userRoutes.post("/register/admin",upload.single('avatar'),adminRegister);

userRoutes.get('/enrollments', isLoggedIn, authorizedRoles('admin'), getEnrolledStudents);



export default userRoutes;