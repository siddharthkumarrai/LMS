import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
  enrollFreeCourse
} from "../redux/features/razorpay/razorpaySlice";
import axiosInstance from "../Helpers/axiosInstance";

interface CourseType {
  _id: string;
  title: string;
  price: number;
  thumbnail: { thumbnailUrl: string };
  description?: string;
  lectures?: any[];
  category?: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

interface RootState {
  auth: { data: { token: string; fullName?: string; email?: string } };
  razorpay: {
    key: string;
    subscription_id: string;
    isPaymentVerified: boolean;
    loading: boolean;
    error: string | null;
  };
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token, data: userData } = useSelector((s: RootState) => s.auth);
  const { key, subscription_id, loading } = useSelector((state: RootState) => state.razorpay);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseType | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setIsLoadingPage(true);
        const { data } = await axiosInstance.get(`/courses/${courseId}`);
        if (data.success && data.course) setCourse(data.course);
        else throw new Error("Course not found");
      } catch {
        toast.error("Failed to load course data.");
        navigate("/not-found");
      } finally {
        setIsLoadingPage(false);
      }
    }
    if (courseId) fetchCourse();
    // Only load Razorpay key if we might need it
    dispatch(getRazorPayId());
  }, [courseId, navigate, dispatch]);

  const subtotal = course?.price || 0;
  const total = subtotal - discount;

  const applyCoupon = () => {

    // Step 1: available coupons
    const availableCoupons = {
      'PW2025': { percentage: 10 }, // 10% discount
      'DIWALI50': { percentage: 50 }, // 50% discount
      'SALE100': { percentage: 100 } // 100% discount
    };

    const trimmedCoupon = coupon.trim().toUpperCase();

    // Step 2: coupon exist
    const couponData = availableCoupons[trimmedCoupon];

    if (couponData) {
      const discountPercentage = couponData.percentage;
      const discountAmount = Math.floor(subtotal * (discountPercentage / 100));

      setDiscount(discountAmount);
      setAppliedCouponCode(trimmedCoupon);

      // Step 3: Dynamic toast message banao
      toast.success(`Coupon "${trimmedCoupon}" applied: ${discountPercentage}% discount`);

    } else {
      // Coupon nahi mila
      setDiscount(0);
      setAppliedCouponCode("");
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.error("Please log in.");
      navigate("/login");
      return;
    }

    setIsPaying(true);

    try {
      // Check if course is free or total is 0 after discount
      if (total <= 0) {
        // Direct free enrollment - no Razorpay needed
        try {
          await dispatch(enrollFreeCourse(courseId!)).unwrap();
          toast.success("You have been enrolled for free!");
          navigate(`/course/${courseId}/player`);
        } catch (enrollError: any) {
          const msg = typeof enrollError === "string" ? enrollError : "Free enrollment failed";

          if (msg.toLowerCase().includes("already subscribed") || msg.toLowerCase().includes("already enrolled")) {
            toast.success("You already own this course. Redirecting...");
            navigate(`/course/${courseId}/player`);
          } else {
            toast.error(msg);
          }
        }
        setIsPaying(false);
        return;
      }

      // Paid flow - load Razorpay and process payment
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error("Failed to load Razorpay SDK.");
        setIsPaying(false);
        return;
      }

      // Create order with discounted amount
      const orderDataAction = await dispatch(
        purchaseCourseBundle({
          courseId: courseId!,
          amount: total, // Send the discounted amount
          couponCode: appliedCouponCode || undefined
        })
      ).unwrap();

      if (!orderDataAction.success) throw new Error("Order creation failed");

      const options = {
        key,
        amount: orderDataAction.order.amount,
        currency: "INR",
        name: course?.title,
        description: appliedCouponCode ? `Course Purchase (Coupon: ${appliedCouponCode})` : "Course Purchase",
        image: course?.thumbnail.thumbnailUrl,
        order_id: orderDataAction.order.id,
        handler: async (response: any) => {
          try {
            await dispatch(
              verifyUserPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                couponCode: appliedCouponCode || undefined,
                discountAmount: discount || undefined,
              })
            ).unwrap();
            toast.success("Payment successful! Redirecting...");
            navigate(`/course/${courseId}/player`);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled.");
            setIsPaying(false);
          },
        },
        prefill: {
          name: userData.fullName || "",
          email: userData.email || "",
        },
        theme: {
          color: "#4F46E5",
        },
        notes: {
          courseId: courseId,
          couponCode: appliedCouponCode || "",
          originalPrice: subtotal,
          discountAmount: discount,
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const msg = typeof err === "string" ? err : "Payment process failed";

      if (msg.toLowerCase().includes("already subscribed")) {
        toast.success("You already own this course. Redirecting...");
        navigate(`/course/${courseId}/player`);
      } else {
        toast.error(msg);
        navigate("/checkout/failure");
      }
      setIsPaying(false);
    }
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 sm:w-64 mx-auto"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoadingPage || !course) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4 leading-tight">
            Complete Your Purchase
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            You're one step away from starting your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Course Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black relative border border-gray-200 dark:border-white/[0.2] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group">

              {/* Course Category Badge */}
              {course.category && (
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                  <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs sm:text-sm font-medium">
                    {course.category}
                  </span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 pr-20 sm:pr-24">
                Course Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-0">

                {/* Course Image */}
                <div className="relative group flex-shrink-0">
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="aspect-video w-full">
                      <img
                        src={course.thumbnail.thumbnailUrl}
                        alt={course.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                          } group-hover:scale-105`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/250';
                          setIsImageLoaded(true);
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Price overlay */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base lg:text-lg font-bold backdrop-blur-sm ${course.price === 0
                        ? 'bg-green-100/90 text-green-800 dark:bg-green-900/90 dark:text-green-200'
                        : 'bg-blue-100/90 text-blue-800 dark:bg-blue-900/90 dark:text-blue-200'
                        }`}>
                        {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-4 sm:space-y-6 flex flex-col">
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex-shrink-0">
                    <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-800 dark:text-white leading-tight break-words hyphens-auto">
                      {course.title}
                    </h4>
                  </div>

                  {course.description && (
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex-1 min-h-0">
                      <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words hyphens-auto overflow-hidden">
                        {course.description.length > 150
                          ? `${course.description.substring(0, 150)}...`
                          : course.description}
                      </p>
                      {course.description.length > 150 && (
                        <button className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mt-2 hover:underline">
                          Read more
                        </button>
                      )}
                    </div>
                  )}

                  {/* Course Stats */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm lg:text-base">{course.lectures?.length || 0} lessons included</span>
                    </div>

                    {course.createdBy && (
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <svg className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm lg:text-base truncate">Instructor: {course.createdBy.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm lg:text-base">Lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black relative border border-gray-200 dark:border-white/[0.2] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 lg:sticky lg:top-8">

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Order Summary</span>
              </h3>

              {/* Course Item */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <img
                    src={course.thumbnail.thumbnailUrl}
                    alt={course.title}
                    className="w-12 sm:w-16 h-9 sm:h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h4 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-800 dark:text-white leading-tight break-words line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Digital Course
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-4 sm:mb-6">
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Coupon
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[44px]"
                      disabled={!!discount}
                    />
                    <button
                      disabled={!!discount}
                      onClick={applyCoupon}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all min-h-[44px] whitespace-nowrap ${discount
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                      type="button"
                    >
                      {discount ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Coupon "{appliedCouponCode}" applied successfully!
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-4 sm:mb-6">
                <div className="space-y-2 sm:space-y-3 py-3 sm:py-4 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm sm:text-base text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mb-4">
                <button
                  disabled={isPaying || loading}
                  onClick={handleCheckout}
                  className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 min-h-[52px]"
                >
                  {isPaying ? (
                    <>
                      <div className="animate-spin h-4 sm:h-5 w-4 sm:w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="hidden sm:inline">
                        {total === 0 ? "Enrolling..." : "Processing Payment..."}
                      </span>
                      <span className="sm:hidden">
                        {total === 0 ? "Enrolling..." : "Processing..."}
                      </span>
                    </>
                  ) : total === 0 ? (
                    <>
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Enroll for Free
                    </>
                  ) : (
                    <>
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Complete Purchase
                    </>
                  )}
                </button>
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>{total === 0 ? 'Secure enrollment process' : 'Secure payment powered by Razorpay'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Course Details</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          hyphens: auto;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          hyphens: auto;
        }
        
        .aspect-video {
          aspect-ratio: 16 / 9;
        }
        
        /* Better word breaking for long words */
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        /* Ensure containers don't overflow */
        .min-h-0 {
          min-height: 0;
        }
        
        /* Flexible grid that maintains proportions */
        @media (min-width: 640px) {
          .sm\\:grid-cols-2 > * {
            min-width: 0;
          }
        }
        
        /* Touch improvements */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:scale-105:hover {
            transform: none;
          }
          
          .hover\\:shadow-2xl:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .border-gray-200 {
            border-color: #000;
          }
          .text-gray-600 {
            color: #000;
          }
        }
        
        /* Focus improvements for keyboard navigation */
        button:focus-visible, 
        input:focus-visible {
          outline: 2px solid #4F46E5;
          outline-offset: 2px;
        }
        
        /* Ensure minimum touch targets */
        @media (max-width: 640px) {
          button, 
          input, 
          [role="button"] {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;