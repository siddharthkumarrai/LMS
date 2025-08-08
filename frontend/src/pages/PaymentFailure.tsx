import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { XCircle } from "lucide-react";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => navigate("/checkout"), 5000);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <XCircle className="mx-auto mb-6 h-16 w-16 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold">Payment Failed</h1>
        <p className="mb-8 text-gray-600">
          Something went wrong. Don’t worry—your card wasn’t charged. You can
          try again or contact support.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/support")}
            className="rounded-md bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
