import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../../Helpers/axiosInstance";

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
  loading: false,
  error: null,
};

// Async thunk to get Razorpay API key from backend
export const getRazorPayId = createAsyncThunk(
  "razorpay/getRazorPayId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/payments/razorpay-key");
      return response.data;
    } catch (error) {
      toast.error("Failed to load Razorpay key");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to create payment order (purchase subscription) for given courseId
export const purchaseCourseBundle = createAsyncThunk(
  "razorpay/purchaseCourseBundle",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/payments/subscribe/${courseId}`);
      return response.data;
    } catch (error) {
      // ✅ Safe error handling
      let errorMessage = "Failed to create order";
      
      if (error.response) {
        // Server responded with error status
        console.error("API Error:", error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        console.error("Network Error:", error.request);
        errorMessage = "No response from server. Check your connection.";
      } else {
        // Request setup error
        console.error("Request Error:", error.message);
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to verify payment after Razorpay payment success
export const verifyUserPayment = createAsyncThunk(
  "razorpay/verifyUserPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payments/verify", {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: data.razorpay_order_id,
        razorpay_signature: data.razorpay_signature,
        courseId: data.courseId,
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment verification failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to get payment records (optional feature)
export const getPaymentRecord = createAsyncThunk(
  "razorpay/getPaymentRecord",
  async (_, { rejectWithValue }) => {
    try {
      const response = axiosInstance.get("/payments?count=100");
      toast.promise(response, {
        loading: "Loading payment records...",
        success: (data) => data.data?.message || "Payment records loaded",
        error: "Failed to load payment records",
      });
      return (await response).data;
    } catch (error) {
      toast.error("Operation failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Razorpay slice with reducers and extraReducers to handle async thunk states
const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {
    // Optional synchronous reducers, e.g., reset state, can be added here
    resetPaymentState: (state) => {
      state.isPaymentVerified = false;
      state.subscription_id = "";
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // getRazorPayId lifecycle handlers
      .addCase(getRazorPayId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.loading = false;
        state.key = action.payload.key || "";
      })
      .addCase(getRazorPayId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get Razorpay key";
      })

      // purchaseCourseBundle lifecycle handlers
      .addCase(purchaseCourseBundle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription_id = action.payload.order?.id || "";
      })
      .addCase(purchaseCourseBundle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create purchase order";
      })

      // verifyUserPayment lifecycle handlers
      .addCase(verifyUserPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserPayment.fulfilled, (state) => {
        state.loading = false;
        state.isPaymentVerified = true;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Payment verification failed";
      })

      // getPaymentRecord lifecycle handlers
      .addCase(getPaymentRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayments = action.payload.allPayments || {};
        state.finalMonths = action.payload.finalMonths || {};
        state.monthlySalesRecord = action.payload.monthlySalesRecord || [];
      })
      .addCase(getPaymentRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load payment records";
      });
  },
});

export const { resetPaymentState } = razorpaySlice.actions;
export default razorpaySlice.reducer;
