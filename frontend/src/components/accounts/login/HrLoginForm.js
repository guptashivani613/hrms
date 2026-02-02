import React,{useState} from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import HashLoader from "react-spinners/HashLoader";
import ErrorMessage from "../../common/ErrorMessage";

const HrLoginForm = ({ email, password, setEmail, setPassword, error, onLogin, onForgotPassword, loading , setError }) => {
  const [showPassword, setShowPassword] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          {/* Form Section */}
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form onSubmit={onLogin} className="space-y-4">
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Sign in to your account and explore a world of possibilities. Your journey begins here.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email *</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Email"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"></path>
                  </svg>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password *</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                  </button>
                </div>
              </div>

              {/* Other fields remain unchanged */}
              <div className="flex justify-end text-sm">
                  <button type="button" onClick={onForgotPassword} className="text-blue-600 hover:underline font-semibold">
                    Forgot your password?
                  </button>
              </div>
              
            {/* Error Message */}
            {error && (
              <ErrorMessage message={error} onClose={() => setError("")} />
            )}
              <div className="!mt-8">
                <button type="submit" className="w-full flex items-center justify-center gap-2 shadow-xl text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  <span className="py-3 px-4">{!loading ? "Log in" : "Logging in..."}</span>
                  <HashLoader
                    color={color}
                    loading={loading}
                    size = {20}
                  />
                </button>
              </div>

              <p className="text-sm !mt-8 text-center text-gray-800">
                Don't have an account?
                <a href="/register" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                  Register here
                </a>
              </p>
            </form>
          </div>

          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <img src="https://readymadeui.com/login-image.webp" className="w-full h-full max-md:w-4/5 mx-auto block object-cover" alt="Login illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrLoginForm;
