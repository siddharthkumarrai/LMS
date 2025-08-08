import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";       // कोई भी icon-pkg काम करेगी

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  /* 5 s बाद ऑटो-रिडायरेक्ट */
  useEffect(() => {
    const id = setTimeout(() => navigate("/my-courses"), 5000);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
        <p className="mb-8 text-gray-600">
          Your purchase is confirmed. You’ll be redirected to your courses
          automatically.
        </p>
        <button
          onClick={() => navigate("/my-courses")}
          className="rounded-md bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          Go to My Courses
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
