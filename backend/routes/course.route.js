import express from "express"
import {
    createCourse,
    createCourseLecture,
    deleteCourse,
    deleteCourseLecture,
    getAllCourses,
    getCourseById,
    getCourseLectures,
    getMyCourses,
    updateCourse,
    updateCourseLecture
} from "../controller/course.controller.js"
import upload from "../middlewares/multer.fileupload.middleware.js"
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js"

const courseRoutes = express.Router()

courseRoutes
    .route("/")
    .post(isLoggedIn, authorizedRoles("admin"), upload.single('thumbnail'), createCourse)
    .get(getAllCourses);


// ===== YEH ROUTE UPAR HONA CHAHIYE =====
// Specific routes (jinka path fixed hai) hamesha dynamic routes (jaise /:id) se pehle aate hain.
courseRoutes.get(
    "/my-courses",
    isLoggedIn,
    authorizedRoles('admin'),
    getMyCourses
);
// =======================================


courseRoutes
    .route("/:id") // <-- Dynamic route ab specific route ke BAAD mein hai
    .get(getCourseById)
    .patch(isLoggedIn, authorizedRoles("admin"), upload.single('thumbnail'), updateCourse)
    .delete(isLoggedIn, authorizedRoles("admin"), deleteCourse)
    .post(isLoggedIn, authorizedRoles("admin"), upload.single('lecture'), createCourseLecture);

courseRoutes
    .route("/:courseId/lectures/:lectureId")
    .delete(isLoggedIn, authorizedRoles("admin"), deleteCourseLecture)
    .patch(isLoggedIn, authorizedRoles("admin"), upload.single('lecture'), updateCourseLecture);

courseRoutes
    .route("/:courseId/lectures")
    .get(isLoggedIn, getCourseLectures);


export default courseRoutes;