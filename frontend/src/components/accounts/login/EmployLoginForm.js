import React,{useState} from "react";
import HashLoader from "react-spinners/HashLoader";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import ErrorMessage from "../../common/ErrorMessage";

const EmployLoginForm = ({ email, password, setEmail, setPassword, error, onLogin, onForgotPassword, loading, setLoading, setError }) => {
  const [showPassword, setShowPassword] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const togglePasswordVisibility = () => { 
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form onSubmit={onLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mt-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>
      </div>
      <ErrorMessage message={error} onClose={() => setError("")} />
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <span className="py-3 px-4">{!loading ? "Login" : "Logging in..."}</span>
        <HashLoader
                    color={color}
                    loading={loading}
                    size = {20}
                  />
      </button>
      <button
        type="button"
        onClick={onForgotPassword}
        className="w-full px-4 py-2 mt-2 text-sm font-medium text-blue-500 bg-gray-100 rounded-lg hover:text-blue-600 focus:outline-none"
      >
        Forgot Password?
      </button>
    </form>
  );
};

export default EmployLoginForm;
