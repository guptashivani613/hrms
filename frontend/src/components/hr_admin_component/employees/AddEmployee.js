import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios_instance from "../../../libs/interseptor";
import apiUrls from "../../../libs/apiUrls";
import {notifySuccess, notifyError} from "../../../components/common/ToastMessage"

const AddEmployee = ({handleBack}) => {
  const [step, setStep] = useState(1); // Step 1: Collect Details, Step 2: Verify OTP
  const [formData, setFormData] = useState({
    first_name:"",
    last_name:"",
    email: "",
    password: "",
    otp: "",
    type: "EMPLOYEE",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const userTypes = [
    { value: "EMPLOYEE", label: "Employee" },
    { value: "HR", label: "HR" },
    { value: "MANAGER", label: "Manager" },
  ];

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user types
  };

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.first_name) {
      newErrors.first_name = "First Name is required";
    }
    if (!formData.last_name) {
      newErrors.last_name = "Last Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDirectRegister = async () => {
    if (!validateStepOne()) return;
  
    setLoading(true);
    const payload = {
      first_name:formData.first_name,
      last_name:formData.last_name,
      email: formData.email,
      password: formData.password,
      type: formData.type,
    };
  
    try {
      await axios_instance.post(apiUrls.HR_REGISTER_OTP, payload);
      setLoading(false); 
      notifySuccess("Employee registered successfully!");
      setFormData({first_name:"",last_name:"", email: "", password: "", otp: "", type: "EMPLOYEE" });
      handleBack()
    } catch (error) {
      setLoading(false);
      console.warn(error)
      // notifyError(error.response?.data?.error || "Failed to register employee.");
    }
  };

  const handleSendOtp = async () => {
    if (!validateStepOne()) return;
    
    if (formData.type === "EMPLOYEE") {
      handleDirectRegister();
      return;
    }

    setLoading(true);
    const payload = {
      first_name:formData.first_name,
      last_name:formData.last_name,
      email: formData.email,
      password: formData.password,
      type: formData.type,
    };

    try {
      await axios_instance.post(apiUrls.HR_REGISTER_OTP, payload);
      setLoading(false);
      notifySuccess("OTP sent successfully!");
      setStep(2);
    } catch (error) {
      setLoading(false);
      // notifyError(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStepTwo()) return;

    setLoading(true);
    const payload = {
      first_name:formData.first_name,
      last_name:formData.last_name,
      email: formData.email,
      otp: formData.otp,
      password: formData.password,
    };

    try {
      await axios_instance.post(apiUrls.HR_REGISTER_OTP_VERIFY, payload);
      setLoading(false);
      notifySuccess("Employee added successfully!");
      setStep(1);
      setFormData({first_name:"", last_name:"", email: "", password: "", otp: "" });
    } catch (error) {
      setLoading(false);
      // notifyError(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Register New Employee</h2>

      {step === 1 && (
        <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your First Name"
                className="customTextInput"
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your Last Name"
                className="customTextInput"
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>
        </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="customTextInput"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="customTextInput pr-10"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Select User Type <span className="text-red-500">*</span>
            </label>
             <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="selectInput"
            >
              {userTypes.map((userType) => (
                <option key={userType.value} value={userType.value}>
                  {userType.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="formCancelBtn"
              onClick={handleBack}
            >
              Cancel
            </button>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="formSubmitBtn"
            >
              {formData.type == 'EMPLOYEE' ? "Register" : "Send OTP"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm shadow-sm focus:outline-none "
              required
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="formCancelBtn"
            >
              Reset
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="formSubmitBtn"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-2">
      </div>
    </div>
  );
};

export default AddEmployee;
