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

// Async thunk for free course enrollment
export const enrollFreeCourse = createAsyncThunk(
  "razorpay/enrollFreeCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/payments/enroll-free/${courseId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to enroll in free course";
      
      if (error.response) {
        console.error("API Error:", error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        console.error("Network Error:", error.request);
        errorMessage = "No response from server. Check your connection.";
      } else {
        console.error("Request Error:", error.message);
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Updated async thunk to create payment order with optional amount and coupon
export const purchaseCourseBundle = createAsyncThunk(
  "razorpay/purchaseCourseBundle",
  async ({ courseId, amount, couponCode }, { rejectWithValue }) => {
    try {
      const payload = {};
      if (amount !== undefined) payload.amount = amount;
      if (couponCode) payload.couponCode = couponCode;
      
      const response = await axiosInstance.post(
        `/payments/subscribe/${courseId}`,
        payload
      );
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create order";
      
      if (error.response) {
        console.error("API Error:", error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        console.error("Network Error:", error.request);
        errorMessage = "No response from server. Check your connection.";
      } else {
        console.error("Request Error:", error.message);
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Updated async thunk to verify payment with coupon information
export const verifyUserPayment = createAsyncThunk(
  "razorpay/verifyUserPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payments/verify", {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: data.razorpay_order_id,
        razorpay_signature: data.razorpay_signature,
        courseId: data.courseId,
        couponCode: data.couponCode,
        discountAmount: data.discountAmount,
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
    // Optional synchronous reducers
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

      // enrollFreeCourse lifecycle handlers
      .addCase(enrollFreeCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollFreeCourse.fulfilled, (state) => {
        state.loading = false;
        state.isPaymentVerified = true;
      })
      .addCase(enrollFreeCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to enroll in free course";
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