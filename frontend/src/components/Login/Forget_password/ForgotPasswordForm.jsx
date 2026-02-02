import React,{useState} from "react";
import FadeLoader from "react-spinners/FadeLoader";
import ErrorMessage from "../../common/ErrorMessage";

const ForgotPasswordForm = ({ email, setEmail, error, onRequestOtp, onBackToLogin, loading, setLoading, setError }) => {
  let [color, setColor] = useState("#ffffff");
  return (
    <form onSubmit={onRequestOtp} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to receive OTP"
          className="w-full px-4 py-2 mt-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <ErrorMessage message={error} onClose={() => setError("")} />
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <span className="py-3 px-4">Send OTP</span>
        <FadeLoader
          color={color}
          loading={loading}
          height={10}
          width={2}
        />
      </button>
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full px-4 py-2 mt-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:text-gray-600 focus:outline-none"
      >
        Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
