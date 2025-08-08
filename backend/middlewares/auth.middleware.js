import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = function (req, res, next) {
    try {
        let { token } = req.cookies

        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError("plese login again", 400));
        }

        const userDetails = jwt.verify(token, process.env.SECRET);
        req.user = userDetails
        next()
    } catch (error) {
        next(error)
    }
}

const authorizedRoles = function (...role) {
    return function (req, res, next) {
        const currentRole = req.user.role
        if (!role.includes(currentRole)) {
            next(new AppError("You dont have Permision to Access this", 403))
        }
        next()
    }
}


export {
    isLoggedIn,
    authorizedRoles
}