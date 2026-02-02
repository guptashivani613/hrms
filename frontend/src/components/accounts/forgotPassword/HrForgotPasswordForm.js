import React, { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import ErrorMessage from "../../common/ErrorMessage";

const HrForgotPasswordForm = ({ email, setEmail, error, onRequestOtp, onBackToLogin, loading, setLoading, setError }) => {
  return (
    <form onSubmit={onRequestOtp} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
          Email *
        </label>
        <div className="relative flex items-center">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to receive OTP"
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#bbb"
            stroke="#bbb"
            className="w-[18px] h-[18px] absolute right-4"
            viewBox="0 0 24 24"
          >
            <path d="M20 12c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8 8-3.59 8-8zm-8-6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm-1 10h2v-2h-2v2zm0-4h2V7h-2v3z" />
          </svg>
        </div>
      </div>
      {error && (
        <ErrorMessage message={error} onClose={() => setError("")} />
      )}
      <div className="!mt-8">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 shadow-xl text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <span className="py-3 px-4">Send OTP</span>
          <FadeLoader
            color="#fff"
            loading={loading}
            height={10}
            width={2}
          />
        </button>
      </div>
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full py-3 px-4 mt-2 text-sm tracking-wide rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 focus:outline-none"
      >
        Back to Login
      </button>
    </form>

  );
};

export default HrForgotPasswordForm;
