import { v2 as cloudinary } from 'cloudinary'

const cloudinaryConfig = async function () {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log("cloudinary config executed")
    } catch (error) {
        next(error)
    }
}

export default cloudinaryConfig;