// src/redux/store.ts / .js
import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer     from './features/auth/authSlice.ts';
import razorpaySliceReducer from './features/razorpay/razorpaySlice';
import courseReducer from './features/courses/courseSlice.ts';
import statsSliceReducer from './features/stats/statsSlice.js';

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    razorpay: razorpaySliceReducer,  
    courses: courseReducer,
     stats: statsSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store
