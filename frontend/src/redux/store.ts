// src/redux/store.ts / .js
import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer     from './features/auth/authSlice.ts';
import razorpaySliceReducer from './features/razorpay/razorpaySlice';
import courseReducer from './features/courses/courseSlice.ts';

const store = configureStore({
  reducer: {
    auth:     authSliceReducer,
    razorpay: razorpaySliceReducer,    // ← यहीं होना चाहिए
    courses: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store
