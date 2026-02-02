import React, { useEffect, useState } from "react";
import Accordion from "./Accordion";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { TfiAnnouncement } from "react-icons/tfi";
import apiUrls from "../../libs/apiUrls";
import axios_instance from "../../libs/interseptor";
import AttendanceRecord from "../attendance/AttendanceRecord";
import EmpAttendanceChart from "./EmpAttendanceChart";
import EmpCards from "./EmpCards";

const EmployDashboard = () => {
  const [totalLeave, setTotalLeave] = useState(0)
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("loggedOut");

  const handleMarkAttendance = async () => {
    try {
      let response;
      if (attendanceStatus === 'loggedIn') {
        response = await axios_instance.post(apiUrls.ATTENDANCE); 
      } else {
        response = await axios_instance.post(apiUrls.ATTENDANCE);
      }

      if (response.status === 201 || response.status === 200) {
        if (attendanceStatus === 'loggedIn') {
          setAttendanceStatus('loggedOut');
          alert("Logout time recorded successfully!");
        } else {
          setAttendanceStatus('loggedIn');
          alert("Login time recorded successfully!");
        }
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      if (error.response && error.response.status === 400) {
        alert("Attendance already closed for today.");
      } else {
        alert("Error occurred while marking attendance.");
      }
    }
  };

    const checkAttendanceStatus = async () => {
      try {
        const response = await axios_instance.get(apiUrls.ATTENDANCE);
        if (response.status === 200) {
          if (response.data[0]?.logout_time === null) {
            setAttendanceStatus('loggedIn'); 
          } else {
            setAttendanceStatus('loggedOut'); 
          }
        }
      } catch (error) {
        console.error("Error checking attendance status:", error);
      }
    };


    const fetchDetails = async () => {
      try {
        const response = await axios_instance.get(apiUrls.LOGIN_EMPLOYEE_DASHBOARD);
        setEmployeeDetails(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    };

    const fetchLeaveBalances = async () => {
      try {
        const response = await axios_instance.get(apiUrls.HR_REGISTER_EMP_LEAVE);

        if (!response?.status == 200) {
          throw new Error('Failed to fetch leave balances');
        }
        const totalLeavesCount = response.data.reduce((sum, leave) => sum + leave.total_leaves, 0);
        setTotalLeave(totalLeavesCount);
      } catch (err) {
        console.log("failed to fetch leave", err.message);
      } finally {
      }
    };

  useEffect(() => {
    checkAttendanceStatus();
    fetchDetails();
    fetchLeaveBalances();
  }, []);
  
  return (
    <div className="min-h-screen space-y-8">

      {/* Header */}
      <header
        className="relative flex items-start justify-between bg-gradient-to-r from-indigo-800 to-indigo-600 p-6 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundImage:
            'url("https://storage.googleapis.com/a1aa/image/1323e672-0c84-4bec-a803-fb97b1e8200e.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        <div className="relative z-10 grid grid-cols-3 items-center space-x-6">
          <div className="relative rounded-full w-64 h-64 overflow-hidden border-4 border-white shadow-2xl">
            <img
              src={employeeDetails?.profilePic || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-white col-span-2">
            <h2 className="text-6xl font-extrabold leading-tight tracking-wide mb-2 capitalize"><span>{employeeDetails?.firstname}</span> <span>{employeeDetails?.lastname}</span></h2>
            <p className="text-2xl font-light opacity-90 mb-4">Welcome to Dataclaps, your journey of growth and excellence begins here! 🚀</p>
            <p className="text-xl opacity-85">
              As a valued member of our team, your dedication drives us forward. Let's make an impact together!
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <p className="text-lg text-gray-700 font-medium">Office Time: <span className="font-bold text-indigo-600">11:00AM to 07:00PM</span></p>

          <button
      onClick={handleMarkAttendance}
      className="flex items-center gap-2 px-3 py-2 bg-indigo-800 text-white rounded-full text-sm font-semibold hover:bg-indigo-900 transition-all duration-300 transform hover:scale-105 shadow-2xl z-10"
    >
      <HiOutlineBellAlert className="w-8 h-8" />
      <span>{attendanceStatus === 'loggedIn' ? 'Logout' : 'Mark Attendance'}</span>
    </button>
        </div>

        <div className="absolute inset-0 bg-black opacity-50 rounded-3xl z-0"></div>
      </header>

      {/* Stats Section */}
      <EmpCards/>

      <AttendanceRecord attendanceStatus={attendanceStatus}/>

      {/* Employee Attendance & Attendance Records */}
      <div className="grid grid-cols-3">
        <div className="col-span-2 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Employee Attendance</h2>
          <p className="text-sm text-gray-500 mb-4">visual breakdown of the Your attendance today.</p>
          <EmpAttendanceChart attendanceStatus={attendanceStatus}/>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2"><TfiAnnouncement/>Announcements</h2>
          <p className="text-sm text-gray-500 mb-4">
            Stay updated with the latest company news and important updates. Check the employee attendance logs for detailed insights.
          </p>
          <Accordion />
        </div>

      </div>

    </div>
  );
};

export default EmployDashboard;
