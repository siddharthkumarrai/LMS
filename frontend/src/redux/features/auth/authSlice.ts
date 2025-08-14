import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../Helpers/axiosInstance"; // Dhyan dein ki yeh path sahi ho
import toast from "react-hot-toast";

// UserProfile aur AuthState ke liye Interfaces (ismein koi badlaav nahi)
interface UserProfile {
    _id: string;
    name: string;
    email: string;
    avatar?: { publicId: string; secureUrl: string };
    role: string;
    gender?: string;
    contactNumber?: string;
    address?: { state: string; city: string; pincode: string };
}

interface AuthState {
    isLoggedIn: boolean;
    role: string;
    token: string | null;
    data: UserProfile | null;
    loading: boolean;
}

// --- FIX 1: LocalStorage se State Load Karne ka Sahi Tareeka ---

const ls = localStorage;

// Yeh chhota function localStorage se data nikalne mein madat karta hai aur error se bachata hai
const getInitialData = (): UserProfile | null => {
    const data = ls.getItem("data");
    try {
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("User data localStorage se nikaalte waqt error:", error);
        return null;
    }
};

// initialState ab data ko sahi aur surakshit tareeke se load karega
const initialState: AuthState = {
    isLoggedIn: ls.getItem("isLoggedIn") === "true",
    role: ls.getItem("role") || "",
    token: ls.getItem("token") || null,
    data: getInitialData(),
    loading: false,
};


// --- API Calls (Async Thunks) ---
// In thunks mein koi khaas badlaav nahi hai, bas error handling ko behtar kiya hai

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("user/update-profile", formData);
            toast.success("Profile updated successfully!");
            return response.data.user;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to update profile.";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/forgotpassword", { email });
            toast.success(response.data.message || "Password reset link sent to your email!");
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to send reset email.";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ resetToken, newPassword }: { resetToken: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/user/forgotpassword/${resetToken}`, { newPassword });
            toast.success(response.data.message || "Password reset successfully!");
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to reset password.";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/change-password", { oldPassword, newPassword });
            toast.success(response.data.message || "Password changed successfully!");
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to change password.";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const verifySession = createAsyncThunk(
    "auth/verifySession",
    async (_, { rejectWithValue }) => {
        try {
            // Yeh API call check karegi ki token valid hai ya nahi
            const response = await axiosInstance.get("/user/me"); 
            return response.data.user; // Agar token sahi hai, to user data return hoga
        } catch (error: any) {
            // Agar token galat hai, to interceptor logout kar dega.
            // Hum yahan se bas error message pass kar rahe hain.
            return rejectWithValue(error?.response?.data?.message || "Session verification failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string } & UserProfile>) => {

            const { token, ...userData } = action.payload;

            ls.setItem("isLoggedIn", "true");
            ls.setItem("role", userData.role);
            ls.setItem("token", token);
            ls.setItem("data", JSON.stringify(userData));

            state.isLoggedIn = true;
            state.role = userData.role;
            state.token = token;
            state.data = userData;
        },

        logout: (state) => {
            ls.clear();

            state.isLoggedIn = false;
            state.role = "";
            state.token = null;
            state.data = null;

            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        },

        clearLoading: (state) => {
            state.loading = false;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                if (state.data) {
                    ls.setItem("data", JSON.stringify(action.payload));
                    state.data = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.rejected, (state) => {
                state.loading = false;
            })

            .addCase(forgotPassword.pending, (state) => { state.loading = true; })
            .addCase(forgotPassword.fulfilled, (state) => { state.loading = false; })
            .addCase(forgotPassword.rejected, (state) => { state.loading = false; })

            .addCase(resetPassword.pending, (state) => { state.loading = true; })
            .addCase(resetPassword.fulfilled, (state) => { state.loading = false; })
            .addCase(resetPassword.rejected, (state) => { state.loading = false; })

            .addCase(changePassword.pending, (state) => { state.loading = true; })
            .addCase(changePassword.fulfilled, (state) => { state.loading = false; })
            .addCase(changePassword.rejected, (state) => { state.loading = false; })
            
            .addCase(verifySession.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                // Agar session valid hai, to state ko dobara aache se set kar do
                state.isLoggedIn = true;
                state.data = action.payload;
                state.role = action.payload.role;
            })
            .addCase(verifySession.rejected, (state) => {
                // Interceptor ne already logout kar diya hoga, hum yahan state saaf kar sakte hain
                state.isLoggedIn = false;
                state.data = null;
                state.role = '';
                state.token = null;
            })
    },
});


// Actions aur Reducer ko export karna
export const { login, logout, clearLoading } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;