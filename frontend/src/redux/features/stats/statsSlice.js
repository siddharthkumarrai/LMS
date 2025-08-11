// redux/slices/statsSlice.js - Add user stats functionality
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../Helpers/axiosInstance";

const initialState = {
    adminStats: {
        overview: {
            totalUsers: 0,
            totalAdmins: 0,
            totalCourses: 0,
            totalRevenue: 0,
            totalEnrollments: 0
        },
        monthlySales: [],
        coursePopularity: [],
        recentActivity: [],
        categoryDistribution: []
    },
    userStats: {
        profile: {
            name: '',
            email: '',
            joinDate: null
        },
        overview: {
            coursesEnrolled: 0,
            coursesCompleted: 0,
            certificatesEarned: 0,
            totalSpent: 0,
            hoursLearned: 0
        },
        enrolledCourses: [],
        categoryDistribution: [],
        recentActivity: []
    },
    isLoading: false,
    error: null
};

// Existing admin stats thunk
export const fetchAdminStats = createAsyncThunk(
    "stats/fetchAdminStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/stats/admin");
            toast.success("Admin dashboard loaded successfully");
            return response.data.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to fetch admin statistics";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// NEW: User stats thunk
export const fetchUserStats = createAsyncThunk(
    "stats/fetchUserStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/stats/user");
            return response.data.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to fetch user statistics";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        clearStats: (state) => {
            state.adminStats = initialState.adminStats;
            state.userStats = initialState.userStats;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch admin stats
            .addCase(fetchAdminStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminStats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch user stats
            .addCase(fetchUserStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userStats = action.payload;
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearStats } = statsSlice.actions;
export default statsSlice.reducer;
