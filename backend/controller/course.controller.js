import CourseModel from "../models/course.model.js";
import AppError from "../utils/error.util.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"

const getAllCourses = async function (req, res, next) {
    try {
        const { search, page = 1, limit = 9 } = req.query;
        
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        
        // Build the query object
        let query = {};
        
        // If search parameter exists, add regex search for title and description
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        // Calculate skip value for pagination
        const skip = (pageNumber - 1) * limitNumber;
        
        // Find courses with pagination and populate instructor details
        const courses = await CourseModel.find(query)
            .populate('createdBy', 'name email') // Populate instructor name and email
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 }); // Sort by newest first
        
        // Get total count for pagination
        const totalCourses = await CourseModel.countDocuments(query);
        const totalPages = Math.ceil(totalCourses / limitNumber);
        
        if (!courses) {
            return next(new AppError("Courses not found", 404));
        }
        
        return res.status(200).json({
            success: true,
            message: search ? `Found ${totalCourses} courses matching "${search}"` : `Found ${totalCourses} courses`,
            courses,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalCourses,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
                limit: limitNumber
            },
            // Backward compatibility
            totalCourses,
            totalPages,
            currentPage: pageNumber
        });
    } catch (error) {
        return next(error);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);

        if (!course) {
            return next(new AppError('Course with this ID does not exist', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Course fetched successfully',
            course
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

const createCourse = async function (req, res, next) {
    try {
        const { title, description, category, price } = req.body

        const userId = req.user.id

        if (!title || !description || !category || !price) {
            return next(new AppError("every field is required", 401));
        }

        const course = await new CourseModel({
            title,
            description,
            category,
            createdBy: userId,
            price,
            thumbnail: {
                thumbnailId: Math.random(),
                thumbnailUrl: "thumbnail_url"
            }
        })

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: "lms/courses", })

                if (result) {
                    course.thumbnail.thumbnailId = result.public_id
                    course.thumbnail.thumbnailUrl = result.secure_url
                }

                fs.rm(req.file.path, { recursive: true })
            } catch (error) {
                return next(error)
            }

        }

        const courseData = await course.save()

        return res.status(200).json({
            success: true,
            courseData
        })

    } catch (error) {
        return next(error)
    }
}

const updateCourse = async function (req, res, next) {
    try {
        const { id } = req.params
        const updateCourseData = { ...req.body }


        if (req.file) {
            try {
                const course = await CourseModel.findById(id)

                if (!course) {
                    return next(new AppError("course not found", 404));
                }

                const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: "lms/courses" })

                if (result) {
                    updateCourseData.thumbnail = {
                        thumbnailId: result.public_id,
                        thumbnailUrl: result.secure_url
                    }

                    if (course.thumbnail && course.thumbnail.thumbnailId) {
                        await cloudinary.v2.uploader.destroy(course.thumbnail.thumbnailId)
                    }

                    fs.rm(req.file.path, { recursive: true })
                }
            } catch (error) {
                return next(error)
            }

        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(
            id,
            { $set: updateCourseData },
            { new: true, runValidators: true }
        )

        if (!updatedCourse) {
            next(new AppError("course not found for update", 404))
        }

        return res.status(200).json({
            success: true,
            message: "Course successfully updated",
            updateCourseData
        })
    } catch (error) {
        return next(error)
    }
}

const deleteCourse = async function (req, res, next) {
    try {
        const { id } = req.params
        console.log(id);

        const deletedCourse = await CourseModel.findByIdAndDelete(id);
        console.log(deletedCourse)
        if (!deletedCourse) {
            return next(new AppError("course not found for delet", 404))
        }

        return res.status(200).json({
            success: true,
            message: "course successfully deleted",
            deletedCourse
        })

    } catch (error) {
        return next(error)
    }
}

const createCourseLecture = async function (req, res, next) {
    try {
        const { id } = req.params;
        const { name, duration } = req.body

        if (!name || !duration) {
            return next(new AppError("name and duration are required", 400))
        }

        if (!req.file) {
            return next(new AppError("Lecture file is required", 404));
        }

        const course = await CourseModel.findById(id)

        if (!course) {
            return next(new AppError("course not foud for add a lecture", 400))
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: `lms/courses/lectures/${course._id}`, resource_type: 'video' })

        if (!result) {
            return next(new AppError("file not be uploded plese try again later", 500))
        }

        const newLecture = {
            name,
            duration,
            lecture: {
                lectureId: result.public_id,
                lectureUrl: result.secure_url
            }
        }

        course.lectures.push(newLecture)

        const courseData = await course.save()

        return res.status(200).json({
            success: true,
            message: "lecture successfully uploded",
            lectures: courseData.lectures
        })

    } catch (error) {
        return next(error)
    }
}

const updateCourseLecture = async function (req, res, next) {
    try {
        const { courseId, lectureId } = req.params
        const { name, duration } = req.body

        const course = await CourseModel.findById(courseId)

        const lecture = course.lectures.find((lecture) => (
            lecture._id.toString() === lectureId
        ))

        if (!lecture) {
            return next(new AppError("lecture not found", 404))
        }

        if (req.file) {
            try {
                if (lecture && lecture.lecture && lecture.lecture.lectureId) {
                    await cloudinary.v2.uploader.destroy(lecture.lecture.lectureId, { resource_type: 'video' })
                }

                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: `lms/courses/lectures/${course._id}`,
                    resource_type: 'video'
                });

                lecture.lecture.lectureId = result.public_id;
                lecture.lecture.lectureUrl = result.secure_url;

                await fs.rm(req.file.path);

            } catch (error) {
                return next(error)
            }
        }

        if (name) lecture.name = name
        if (duration) lecture.duration = duration

        const courseData = await course.save()

        return res.status(200).json({
            success: true,
            message: "lecture successfully updated",
            lectures: courseData.lectures
        })

    } catch (error) {
        return next(error)
    }
}

const deleteCourseLecture = async function (req, res, next) {
    try {
        const { courseId, lectureId } = req.params

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new AppError("course not found for delete", 404))
        }

        const lecture = course.lectures.find((lecture) => (
            lecture._id.toString() === lectureId
        ))

        if (!lecture) {
            return next(new AppError("lecture not exist for deleting", 404))
        }

        if (lecture && lecture.lecture && lecture.lecture.lectureId) {
            try {
                await cloudinary.v2.uploader.destroy(lecture.lecture.lectureId, {
                    resource_type: 'video'
                })
            } catch (error) {
                next(error)
            }
        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            {
                $pull: { lectures: { _id: lectureId } },
            },
            {
                new: true
            }
        )

        return res.status(200).json({
            success: true,
            message: "lecture successfully deleted",
            lectures: updatedCourse.lectures
        })
    } catch (error) {
        return next(error)
    }
}


const getCourseLectures = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    
    const course = await CourseModel.findById(courseId)
      .select("title lectures");          

    if (!course)
      return next(new AppError("Course not found", 404));

    
    const payload = {
      courseTitle: course.title,
      lectures: course.lectures.map((lec) => ({
        _id:        lec._id,
        title:      lec.name,
        duration:   lec.duration,
        videoUrl:   lec.lecture.lectureUrl,
      })),
    };

    res.json({ success: true, ...payload });
  } catch (err) {
    next(err);
  }
};

const getMyCourses = async (req, res, next) => {
    try {
        const instructorId = req.user.id;
        console.log(instructorId);

        const courses = await CourseModel.find({ createdBy: instructorId }).populate('createdBy', 'name') .sort({ createdAt: -1 });
        console.log(courses);

        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};



export {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    createCourseLecture,
    deleteCourseLecture,
    updateCourseLecture,
    getCourseLectures,
    getMyCourses
}