import React, { useState } from "react";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import OtpForm from "../../components/Login/Forget_password/OtpForm";
import HrLoginForm from "../../components/accounts/login/HrLoginForm";
import HrForgotPasswordForm from "../../components/accounts/forgotPassword/HrForgotPasswordForm";
import * as URLS from "../../libs/apiUrls"
import {loginSuccess} from "../../redux/auth/authSlice"
import {notifySuccess, notifyError} from "../../components/common/ToastMessage"

const HrLoginPage = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentForm, setCurrentForm] = useState("login");
  let [loading, setLoading] = useState(false);

  const publicAxios = axios.create(); // No interceptors for this instance

  async function submitHandle(e) {
    e.preventDefault();
    setLoading(true)
    setError("");
    const params = { email, password };
  
    try {
      const response = await publicAxios.post(URLS.HR_LOGIN, params);

      if (response.status === 200 && response?.data?.type == 'HR' && response.data?.user_id) {
          //dispatch api response
          dispatch(loginSuccess({...response.data, userType: 'hr' }))   
          setLoading(false)  
          history.push(`/hr/dashboard`);
      } else {
        setError("Invalid login credentials. Please try again.");
        setLoading(false) 
      }
    } catch (err) {
      if (err.response) {
        console.warn(err)
        if (err.response.status === 500) {
          setError(err.response.data?.detail || "Server error. Please try again later.");
        } else {
          setError(err.response.data?.detail || "An error occurred. Please try again.");
        }
      } else if (err.request) {
        setError("No response from the server. Please check your network.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false) 
    } finally{
      setLoading(false) 
    }
  }
  
  
    // Reset password with OTP
    const handleResetPassword = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true)
      try {
        const payload = { email, otp, new_password: newPassword }
        const response =await axios.post(URLS.HR_RESET_PASS, payload)
  
        if (response.status == 200) {
          setShowOtpForm(false);
          setEmail("");
          setPassword("");
          setCurrentForm("login");
          setLoading(false)
        } else {
          const errorData = await response.json();
          setError(errorData.message, "Password reset failed");
          setLoading(false)
        }
      } catch (error) {
        setError(error.response?.data[0] || "Something went wrong. Please try again.");
        console.warn("errr",error);
        setLoading(false)
      }finally{
        setLoading(false)
      }
    };
  
    // OTP for password reset
    const handleForgotPasswordRequest = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true)
      try {
        const payload = { email }
        const response =await axios.post(URLS.HR_FORGET_PASS, payload)
  
        if (response.status==200) {
          setShowOtpForm(true);
          setCurrentForm("otp");
        } else {
          const errorData = await response.json();
          setError("Failed to verify OTP. Please try again.");
          setLoading(false)
        }
      } catch (error) {
        setError(error.response?.data[0] || "Something went wrong. Please try again.");
        setLoading(false)
        console.warn(error);
      }finally{
        setLoading(false)
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-800 mt-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        {currentForm === "login" && (
          <HrLoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            error={error}
            onLogin={submitHandle}
            onForgotPassword={() => setCurrentForm("forgotPassword")}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
          />
        )}
        {currentForm === "forgotPassword" && (
          <HrForgotPasswordForm
            email={email}
            setEmail={setEmail}
            error={error}
            onRequestOtp={handleForgotPasswordRequest}
            onBackToLogin={() => setCurrentForm("login")}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
          />
        )}
        {currentForm === "otp" && (
          <OtpForm
            otp={otp}
            newPassword={newPassword}
            setOtp={setOtp}
            setNewPassword={setNewPassword}
            error={error}
            onResetPassword={handleResetPassword}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
          />
        )}
        </div>
    </div>
  );
}

export function Logout() {
  return <Redirect to="/" />;
}

export default HrLoginPage;
