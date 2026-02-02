import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import ForgotPasswordForm from "../../components/Login/Forget_password/ForgotPasswordForm";
import OtpForm from "../../components/Login/Forget_password/OtpForm";
import EmployLoginPage from "../accounts/EmployLoginPage";
import * as URLS from "../../libs/apiUrls"
import EmployLoginForm from "../../components/accounts/login/EmployLoginForm";
import {loginSuccess} from "../../redux/auth/authSlice"

const HomePage = () => {
  const dispatch = useDispatch()
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentForm, setCurrentForm] = useState("login");
  let [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try { 
      const payload = { email, password };
      const response = await axios.post(URLS.HR_LOGIN, payload);
      console.log(response);
  
      if (response.status === 200 && response.data?.user_id) {
        if(response.data?.type == "EMPLOYEE" || response.data?.type == "MANAGER"){
        dispatch(loginSuccess({...response.data, userType: "employ"})) 
        setLoading(false)      
        history.push("/employ/dashboard");
        }
        if(response.data?.type == "HR"){
          dispatch(loginSuccess({...response.data, userType: 'hr' }))   
          setLoading(false)  
          history.push(`/hr/dashboard`);
        }
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false); 
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again!");
      console.warn(err);
      setLoading(false); 
    } finally {
      setLoading(false);
    }
  };
  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("");
    try {
      const payload = { email, otp, new_password: newPassword }
      const response =await axios.post(URLS.HR_RESET_PASS, payload)

      if (response.status == 200) {
        alert("Password reset successful. You can now log in.");
        setShowOtpForm(false);
        setEmail("");
        setPassword("");
        setCurrentForm("login");
        setLoading(false)
      } else {
        const errorData = await response.json();
        setLoading(false)
        
        setError(errorData.message || "Password reset failed");
      }
    } catch (error) {
      setError(error?.response?.data[0] || "Something went wrong. Please try again.");
      setLoading(false)
      console.warn(error);
    }
  };

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
        setLoading(false)
      } else {
        const errorData = await response.json();
        setError("Failed to verify OTP. Please try again.");
        setLoading(false)
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Something went wrong. Please try again.");
      setLoading(false)
      console.warn(error);
    }finally{
      setLoading(false)
    }
  };

  const redirectTo = (subUrl) => {
    setTimeout(() => {
      history.push(subUrl);
    }, 400)
  }

  const handleLoginHr = () => {
    redirectTo("/login");
  }

  const handleRegisterHr = () => {
    redirectTo("/register");
  }

  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <header className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900">
              HR & Employee Management Portal
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Simplifying HR operations and empowering employees with an elegant, centralized platform.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:justify-around gap-12">
            {/* Left Section */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800">Your Workplace, One Click Away – Sign In.</h2>
              <div className="max-w-md mx-auto">
      {currentForm === "login" && (
                  <EmployLoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    error={error}
                    onLogin={handleLogin}
                    onForgotPassword={() => setCurrentForm("forgotPassword")}
                    loading={loading}
                    setLoading={setLoading}
                    setError={setError}
                  />
                )}
                {currentForm === "forgotPassword" && (
                  <ForgotPasswordForm
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

            {/* Right Section */}
            <div className="w-full lg:max-w-lg">
              <img
                src="https://i0.wp.com/dataclaps.com/wp-content/uploads/2023/03/My-project-3.png?w=957&ssl=1"
                alt="Workflow Overview"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-md">
            <img
              src="https://storage.googleapis.com/a1aa/image/Q9eFZlIPRSyNIimmmjfeAxvzZ57RMNpgyMiyTQOswJ7HTlpnA.jpg"
              alt="Feature 1"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Employee Self-Service</h3>
            <p className="text-gray-600 mt-2">
              Employees can access payslips, apply for leaves, and update profiles effortlessly.
            </p>
          </div>
          <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-md">
            <img
              src="https://storage.googleapis.com/a1aa/image/aQX686yq3UZ1P9kCP5q7VHbe1f1KSRsTmeAcFe59OsdpyKTPB.jpg"
              alt="Feature 2"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">HR Dashboard</h3>
            <p className="text-gray-600 mt-2">
              HR managers can track attendance, monitor performance, and manage payroll efficiently.
            </p>
          </div>
          <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-md">
            <img
              src="https://storage.googleapis.com/a1aa/image/NkqN25B3ATLQCJYKuNPvxlyIFKv6Crhi47ytLImeavyrVZ6JA.jpg"
              alt="Feature 3"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Analytics</h3>
            <p className="text-gray-600 mt-2">
              Gain insights through interactive charts and reports for better workforce management.
            </p>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="bg-gray-50 py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Insights at a Dataclaps
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Get a clear picture of key metrics and take data-driven decisions.
        </p>
        <div className="flex justify-center">
          <img
            src="data:image/png;base64,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"
            alt="Dashboard Insights"
            className="rounded-lg shadow-md w-full"
          />
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-gray-600 mb-8">
            Log in to explore all features tailored to your needs.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button onClick={handleRegisterHr} className="bg-gray-900 text-white px-8 py-3 rounded-md shadow-md hover:bg-gray-800">
              HR Register
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-500">
        <p>© 2024 HR & Employee Management Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
