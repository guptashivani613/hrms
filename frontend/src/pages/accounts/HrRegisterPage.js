import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import * as URLS from "../../libs/apiUrls";
import ErrorMessage from "../../components/common/ErrorMessage";

function HrRegisterPage() {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("1");
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true)
    setError("");
    const payload = {
      "email": email,
      "password": password,
      "first_name":first_name,
      "last_name":last_name,
      "type": "HR"
    }
    axios.post(URLS.HR_REGISTER_OTP, payload)
      .then((res) => {
        setTab("2");
        setLoading(false)
      }).catch((err) => {
        setError(err.response?.data?.error || "An error occurred");
        console.warn(err);
        setLoading(false)
      }).finally(()=>{
        setLoading(false)
      })
  }

  const handleOtpForm = (event) => {
    event.preventDefault();
    setLoading(true)
    setError("");
    const payload = {
      "email": email,
      "first_name":first_name,
      "last_name":last_name,
      "otp": otp,
      "password": password
    }

    axios.post(URLS.HR_REGISTER_OTP_VERIFY, payload)
      .then((res) => {
        setTab("3");
        setLoading(false)
      }).catch((err) => {
        console.warn(err);
        setError(err.response?.data?.otp[0]|| "An error occurred");
        setLoading(false)
      }).finally(()=>{
        setLoading(false)
      })
  }

  return (
    <div>
      <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
        <div className="max-w-md max-h-screen overflow-y-scroll w-full mx-auto border border-gray-300 rounded-2xl p-8">
          <div className="text-center mb-12">
            <a href="/"><img
              src="https://media.licdn.com/dms/image/v2/D4D0BAQE0B5f5KUjoDg/company-logo_200_200/company-logo_200_200/0/1694285115143/dataclaps_logo?e=1756944000&v=beta&t=3EfvgOjNGpeu8oSAeNcyMFwPCWpmVruDf_V7J5YowuE" alt="logo" className='w-40 inline-block' />
            </a>
          </div>
          <ErrorMessage message={error} onClose={() => setError("")} />
          {tab === '1' && <form onSubmit={handleSubmit} >
            <div className="space-y-6">
            <div>
                <label className="text-gray-800 text-sm mb-2 block">First Name *</label>
                <input
                  name="first_name"
                  type="text"
                  value={first_name}
                  onChange={(event) => setFirst_name(event.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Last Name *</label>
                <input
                  name="last_name"
                  type="text"
                  value={last_name}
                  onChange={(event) => setLast_name(event.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email *</label>
                <input
                  name="email"
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="email"
                  required
                />
              </div>

              <div className="relative">
                <label className="text-gray-800 text-sm mb-2 block">Password *</label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              <div className="flex items-center">
                <input required id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label for="remember-me" className="text-gray-800 ml-3 block text-sm">
                  I accept the <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline ml-1">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <div className="!mt-12">
              <button type="submit" className="w-full flex items-center justify-center gap-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                <span className="py-3 px-4">{!loading ? "Send OTP" :"Sending OTP..."} </span> 
                {loading &&
                  <HashLoader
                    color={color}
                    loading={loading}
                    size = {20}
                  />
                }
              </button>
            </div>
            <p className="text-gray-800 text-sm mt-6 text-center">Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline ml-1">Login here</a></p>
          </form>}

          {tab === '2' &&
            <form onSubmit={handleOtpForm} >
              <div className="space-y-6">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">OTP *</label>
                  <input
                    name="otp"
                    type="number"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <div className="!mt-12">
                  <button type="button" onClick={() => setTab("1")} className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-gray-600 bg-gray-50 focus:outline-none">
                    back
                  </button>
                </div>
                <div className="!mt-4">
                  <button type="submit" className="w-full flex items-center justify-center gap-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                   <span className="py-3 px-4">{!loading ? "Submit OTP" : "Submitting OTP..."}</span> 
                    {loading &&
                    <HashLoader
                    color={color}
                    loading={loading}
                    size = {20}
                  />
                }
                  </button>
                </div>
              </div>
            </form>
          }

          {tab === "3" &&
            <div className="space-y-6 bg-gray-50 p-4">
              <div>

              </div>
              <h1 className="text-gray-500 text-center text-2xl">Hr Created Succefully  </h1>
              <p className="text-gray-800 text-sm mt-6 text-center">Please <a href="/" className="text-blue-600 font-semibold hover:underline ml-1">Login here</a></p>
            </div>
          }
        </div>
      </div>


    </div>
  );
}

export default HrRegisterPage;
