import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// Course data interface
interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail: { 
        thumbnailId?: string;
        thumbnailUrl?: string;
        secureUrl?: string; 
    };
    lectures: Lecture[];
    createdBy: {
        _id: string;
        name: string;
        email: string;
    } | string;
    createdAt?: string;
    updatedAt?: string;
}

interface Lecture {
    _id: string;
    name: string;
    duration: string;
    lecture: {
        lectureId: string;
        lectureUrl: string;
    };
}

interface CourseState {
    myCourses: Course[];
    allCourses: Course[];
    freeCourses: Course[]; // Add freeCourses to the state
    currentCourse: Course | null;
    loading: boolean;
    searchLoading: boolean;
    freeCoursesLoading: boolean; // Add specific loading state for free courses
    totalPages: number;
    currentPage: number;
    totalCourses: number;
    error: string | null;
}

const initialState: CourseState = {
    myCourses: [],
    allCourses: [],
    freeCourses: [], // Initialize freeCourses as empty array
    currentCourse: null,
    loading: false,
    searchLoading: false,
    freeCoursesLoading: false, // Initialize free courses loading state
    totalPages: 0,
    currentPage: 1,
    totalCourses: 0,
    error: null,
};

// New async thunk for fetching free courses
export const fetchFreeCourses = createAsyncThunk(
    "courses/fetchFreeCourses",
    async (_, { rejectWithValue }) => {
        try {
            console.log('🚀 Fetching free courses...');
            const response = await axiosInstance.get('/courses/free');
            console.log('✅ Free courses response:', response.data);

            const responseData = response.data;
            const courses = responseData.courses || responseData.data || [];

            console.log('📊 Processed free courses:', {
                coursesCount: courses.length,
                firstCourse: courses[0]
            });

            return {
                courses,
                totalCourses: responseData.totalCourses || courses.length
            };
        } catch (error: any) {
            console.error('❌ Error fetching free courses:', error);
            const errorMessage = error?.response?.data?.message || "Failed to fetch free courses.";
            
            // Only show toast for actual errors, not for empty results
            if (error?.response?.status !== 404) {
                toast.error(errorMessage);
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk for fetching created courses
export const fetchMyCreatedCourses = createAsyncThunk(
    "courses/fetchMyCreated",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("courses/my-courses");
            console.log('My created courses response:', response.data);
            return response.data.courses || response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to fetch courses.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk for fetching subscribed courses
export const fetchMySubscribedCourses = createAsyncThunk(
    "courses/fetchMySubscribed",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("user/me");
            console.log('My subscribed courses response:', response.data);
            return response.data.user?.subscriptions || [];
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to fetch subscribed courses.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// FIXED: Enhanced fetchAllCourses with better error handling and structure
export const fetchAllCourses = createAsyncThunk(
    "courses/fetchAll",
    async (
        { searchQuery, page = 1, limit = 10 }: {
            searchQuery?: string;
            page?: number;
            limit?: number;
        } = {},
        { rejectWithValue }
    ) => {
        try {
            console.log('🚀 Fetching courses with params:', { searchQuery, page, limit });

            let url = `/courses?page=${page}&limit=${limit}`;
            if (searchQuery && searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery.trim())}`;
            }

            console.log('📡 API URL:', url);

            const response = await axiosInstance.get(url);
            console.log('✅ Raw API response:', response.data);

            // Handle different possible response structures
            const responseData = response.data;
            let courses: any = [];
            let totalPages = 0;
            let currentPage = 1;
            let totalCourses = 0;

            // Check various possible structures
            if (responseData.courses && Array.isArray(responseData.courses)) {
                courses = responseData.courses;
                totalPages = responseData.totalPages || 1;
                currentPage = responseData.currentPage || 1;
                totalCourses = responseData.totalCourses || courses.length;
            } else if (responseData.data && Array.isArray(responseData.data)) {
                courses = responseData.data;
                totalPages = responseData.totalPages || 1;
                currentPage = responseData.currentPage || 1;
                totalCourses = responseData.totalCourses || courses.length;
            } else if (Array.isArray(responseData)) {
                courses = responseData;
                totalPages = 1;
                currentPage = 1;
                totalCourses = courses.length;
            } else {
                console.warn('⚠️ Unexpected response structure:', responseData);
                courses = [];
            }

            console.log('📊 Processed courses data:', {
                coursesCount: courses.length,
                totalPages,
                currentPage,
                totalCourses,
                firstCourse: courses[0]
            });

            return {
                courses,
                totalPages,
                currentPage,
                totalCourses
            };
        } catch (error: any) {
            console.error('❌ Error fetching courses:', error);
            const errorMessage = error?.response?.data?.message || "Failed to fetch courses.";

            // Only show toast for actual errors, not for empty results
            if (error?.response?.status !== 404) {
                toast.error(errorMessage);
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk for fetching course details
export const fetchCourseDetails = createAsyncThunk(
    "courses/fetchDetails",
    async (courseId: string, { rejectWithValue }) => {
        try {
            console.log('Fetching course details for ID:', courseId);
            const response = await axiosInstance.get(`/courses/${courseId}`);
            console.log('Course details response:', response.data);
            return response.data.course || response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to fetch course details.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);  
        }
    }
);

// Async Thunk for adding lecture
export const addLectureToCourse = createAsyncThunk(
    "courses/addLecture",
    async (data: { courseId: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const { courseId, formData } = data;
            const response = await axiosInstance.post(`/courses/${courseId}`, formData);
            toast.success("Lecture added successfully!");
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to add lecture.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk for deleting lecture
export const deleteLectureFromCourse = createAsyncThunk(
    "courses/deleteLecture",
    async (data: { courseId: string; lectureId: string }, { rejectWithValue }) => {
        try {
            const { courseId, lectureId } = data;
            const response = await axiosInstance.delete(`/courses/${courseId}/lectures/${lectureId}`);
            toast.success("Lecture deleted successfully!");
            return response.data.lectures;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to delete lecture.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Add this to your existing async thunks
export const deleteCourse = createAsyncThunk(
    "courses/deleteCourse",
    async (courseId: string, { rejectWithValue }) => {
        try {
            console.log('Deleting course with ID:', courseId);
            const response = await axiosInstance.delete(`/courses/${courseId}`);
            toast.success("Course deleted successfully!");
            return courseId; // Return the deleted course ID
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to delete course.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        // Clear search results
        clearAllCourses: (state) => {
            state.allCourses = [];
            state.totalPages = 0;
            state.currentPage = 1;
            state.totalCourses = 0;
            state.error = null;
        },
        // Clear free courses
        clearFreeCourses: (state) => {
            state.freeCourses = [];
            state.error = null;
        },
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
        // Reset loading states
        resetLoading: (state) => {
            state.loading = false;
            state.searchLoading = false;
            state.freeCoursesLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Free Courses - New handlers
            .addCase(fetchFreeCourses.pending, (state) => {
                state.freeCoursesLoading = true;
                state.error = null;
                console.log('🔄 fetchFreeCourses pending - setting freeCoursesLoading to true');
            })
            .addCase(fetchFreeCourses.fulfilled, (state, action) => {
                console.log('✅ fetchFreeCourses fulfilled with payload:', action.payload);
                state.freeCoursesLoading = false;
                state.freeCourses = action.payload.courses || [];
                state.error = null;
                console.log('📝 State updated - freeCourses length:', state.freeCourses.length);
            })
            .addCase(fetchFreeCourses.rejected, (state, action) => {
                console.log('❌ fetchFreeCourses rejected with error:', action.payload);
                state.freeCoursesLoading = false;
                state.freeCourses = [];
                state.error = action.payload as string;
            })

            // My Created Courses
            .addCase(fetchMyCreatedCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyCreatedCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.myCourses = action.payload || [];
                state.error = null;
            })
            .addCase(fetchMyCreatedCourses.rejected, (state, action) => {
                state.loading = false;
                state.myCourses = [];
                state.error = action.payload as string;
            })

            // My Subscribed Courses
            .addCase(fetchMySubscribedCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMySubscribedCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.myCourses = action.payload || [];
                state.error = null;
            })
            .addCase(fetchMySubscribedCourses.rejected, (state, action) => {
                state.loading = false;
                state.myCourses = [];
                state.error = action.payload as string;
            })

            // FIXED: All Courses (with enhanced handling)
            .addCase(fetchAllCourses.pending, (state) => {
                state.searchLoading = true;
                state.error = null;
                console.log('🔄 fetchAllCourses pending - setting searchLoading to true');
            })
            .addCase(fetchAllCourses.fulfilled, (state, action) => {
                console.log('✅ fetchAllCourses fulfilled with payload:', action.payload);
                state.searchLoading = false;
                state.loading = false;
                state.allCourses = action.payload.courses || [];
                state.totalPages = action.payload.totalPages || 0;
                state.currentPage = action.payload.currentPage || 1;
                state.totalCourses = action.payload.totalCourses || 0;
                state.error = null;

                console.log('📝 State updated - allCourses length:', state.allCourses.length);
            })
            .addCase(fetchAllCourses.rejected, (state, action) => {
                console.log('❌ fetchAllCourses rejected with error:', action.payload);
                state.searchLoading = false;
                state.loading = false;
                state.allCourses = [];
                state.totalPages = 0;
                state.currentPage = 1;
                state.totalCourses = 0;
                state.error = action.payload as string;
            })

            // Single Course Details
            .addCase(fetchCourseDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
                state.error = null;
            })
            .addCase(fetchCourseDetails.rejected, (state, action) => {
                state.loading = false;
                state.currentCourse = null;
                state.error = action.payload as string;
            })

            // Delete Course Case
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted course from myCourses array
                state.myCourses = state.myCourses.filter(course => course._id !== action.payload);
                // Also remove from allCourses if it exists there
                state.allCourses = state.allCourses.filter(course => course._id !== action.payload);
                // Also remove from freeCourses if it exists there
                state.freeCourses = state.freeCourses.filter(course => course._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add Lecture
            .addCase(addLectureToCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(addLectureToCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentCourse && action.payload.lectures) {
                    state.currentCourse.lectures = action.payload.lectures;
                }
            })
            .addCase(addLectureToCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete Lecture
            .addCase(deleteLectureFromCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteLectureFromCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentCourse) {
                    state.currentCourse.lectures = action.payload || [];
                }
            })
            .addCase(deleteLectureFromCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAllCourses, clearFreeCourses, clearError, resetLoading } = courseSlice.actions;
export default courseSlice.reducer;