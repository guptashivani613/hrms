import React,{useState} from "react";
import FadeLoader from "react-spinners/FadeLoader";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import ErrorMessage from "../../common/ErrorMessage";

const OtpForm = ({ otp, newPassword, setOtp, setNewPassword, error, onResetPassword, loading, setLoading, setError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => { 
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form onSubmit={onResetPassword} className="space-y-6">
    {/* OTP Input */}
    <div>
      <label htmlFor="otp" className="text-gray-800 text-sm mb-2 block">
        OTP *
      </label>
      <input
        id="otp"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter the OTP sent to your email"
        className="w-full px-4 py-3 mt-1 text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
        required
      />
    </div>
  
    {/* New Password Input */}
    <div>
        <label htmlFor="newPassword" className="text-gray-800 text-sm mb-2 block">
          New Password *
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-4 py-3 mt-1 text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>
      </div>
  
    {/* Error Message */}
    {error && (
        <ErrorMessage message={error} onClose={() => setError("")} />
    )}
  
    {/* Reset Password Button */}
    <button
      type="submit"
      className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 focus:outline-none shadow-md"
    >
      <span className="py-3 px-4">Reset Password</span>
      <FadeLoader
            color="#fff"
            loading={loading}
            height={10}
            width={2}
          />
    </button>
  </form>
  
  );
};

export default OtpForm;
