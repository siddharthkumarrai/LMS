import mongoose from "mongoose";
import { Schema } from "mongoose";

const courseSchema = Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [10, "Title must be at least 10 characters long"],
        maxLength: [100, "Title cannot exceed 100 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [20, "Description must be at least 20 characters long"],
        maxLength: [1000, "Description cannot exceed 1000 characters"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
        max: [10000, "Price cannot exceed $10,000"]
    },
    thumbnail: {
        thumbnailId: {
            type: String,
            required: [true, "Thumbnail ID is required"]
        },
        thumbnailUrl: {
            type: String,
            required: [true, "Thumbnail URL is required"],
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lectures: [{
        name: {
            type: String,
            required: [true, "Lecture name is required"],
            minLength: [5, "Lecture name must be at least 5 characters long"],
            maxLength: [100, "Lecture name cannot exceed 100 characters"],
            trim: true
        },
        duration: {
            type: String,
            required: [true, "Lecture duration is required"],
            validate: {
                validator: function (duration) {
                    // Validates format like "10:30", "1:05:45", etc.
                    return /^\d{1,2}:\d{2}(:\d{2})?$/.test(duration);
                },
                message: "Duration must be in format MM:SS or HH:MM:SS"
            }
        },
        lecture: {
            lectureId: {
                type: String,
                required: [true, "Lecture ID is required"]
            },
            lectureUrl: {
                type: String,
                required: [true, "Lecture URL is required"],
            }
        }
    }],
},
    {
        timestamps: true
    }
);


const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;