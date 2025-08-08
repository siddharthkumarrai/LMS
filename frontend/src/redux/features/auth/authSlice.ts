import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// UserProfile and AuthState interfaces
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

const ls = localStorage;
const initialState: AuthState = {
    isLoggedIn: ls.getItem("isLoggedIn") === "true",
    role: ls.getItem("role") || "",
    token: ls.getItem("token") && ls.getItem("token") !== "undefined" ? ls.getItem("token") : null,
    data: JSON.parse(ls.getItem("data") || "null"),
    loading: false,
};

// Existing updateProfile thunk
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData: FormData) => {
        try {
            const response = await axiosInstance.put("user/update-profile", formData);
            toast.success("Profile updated successfully!");
            return response.data.user;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update profile.");
            throw error;
        }
    }
);

// NEW: Forgot Password thunk
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string) => {
        try {
            const response = await axiosInstance.post("/user/forgotpassword", { email });
            toast.success(response.data.message || "Password reset link sent to your email!");
            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send reset email.");
            throw error;
        }
    }
);

// NEW: Reset Password thunk
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ resetToken, newPassword }: { resetToken: string; newPassword: string }) => {
        try {
            const response = await axiosInstance.post(`/user/forgotpassword/${resetToken}`, { newPassword });
            toast.success(response.data.message || "Password reset successfully!");
            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to reset password.");
            throw error;
        }
    }
);

// NEW: Change Password thunk
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
        try {
            const response = await axiosInstance.post("/user/change-password", { 
                oldPassword, 
                newPassword 
            });
            toast.success(response.data.message || "Password changed successfully!");
            return response.data;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to change password.");
            throw error;
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string } & UserProfile>) => {
            const payloadData = action.payload;

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", payloadData.role);
            localStorage.setItem("token", payloadData.token);
            localStorage.setItem("data", JSON.stringify(payloadData));

            state.isLoggedIn = true;
            state.role = payloadData.role;
            state.token = payloadData.token;
            state.data = payloadData;
        },

        logout: (state) => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            localStorage.removeItem("token");
            localStorage.removeItem("data");

            state.isLoggedIn = false;
            state.role = "";
            state.token = null;
            state.data = null;
        },

        clearLoading: (state) => {
            state.loading = false;
        }
    },

    extraReducers: (builder) => {
        builder
            // Update Profile cases
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                localStorage.setItem("data", JSON.stringify(action.payload));
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.rejected, (state) => {
                state.loading = false;
            })
            
            // Forgot Password cases
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state) => {
                state.loading = false;
            })
            
            // Reset Password cases
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state) => {
                state.loading = false;
            })
            
            // Change Password cases
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { login, logout, clearLoading } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;