import React, { useState, useEffect } from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { TfiAnnouncement } from "react-icons/tfi";
import { Chart as ChartJS, CategoryScale, PointElement, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios_instance from "../../../libs/interseptor";
import apiUrls from "../../../libs/apiUrls";
import Accordion from "../../dashboard/Accordion";
import DetailsCard from "../../dashboard/DetailsCard";
import MeetingSchedule from "../../dashboard/MeetingSchedule";
import AbsentToday from "../../dashboard/AbsentToday";
import EmpAttendanceChart from "../../dashboard/EmpAttendanceChart";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

const HrDashboard = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [hrDetail, setHrDetail] = useState(null);
  const [employeeDetail, setEmployeeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [userAttendance, setUserAttendance] = useState(null)

  const hrDetails = async () => {
    setLoading(false);
    setLoading(false);
    try {
      const response = await axios_instance.get(apiUrls.HR_DETAILS);
      setHrDetail(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch salary details:", error);
      setError("Failed to load employee details.");
      setLoading(false);
    }
  };

  const employeeLeaveGet = async () => {
    try {
      const response = await axios_instance.get(apiUrls.LOGIN_EMPLOYEE_LEAVE_APPLY);
      const pending = response?.data.filter((el) => el?.status === 'Pending')
      setLeaveData(pending);
    } catch (error) {
      console.error("Failed to fetch leave details:", error);
    }
  }

  const employeeDetails = async () => {
    setLoading(false);
    setLoading(false);
    try {
      const response = await axios_instance.get(apiUrls.USER_FIND);
      if (response.status === 200) {
        const verifiedUsers = response.data.filter((user) => user.otp_verified === true);
        setEmployeeDetail(verifiedUsers);
        setLoading(false);
      }

    } catch (error) {
      setError("Failed to load employee details.");
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, status) => {
    const leave = leaveData.find((l) => l.id === id);

    const payload = {
      leave_type: leave.leave_type,
      start_date: leave.start_date,
      end_date: leave.end_date,
      reason: leave.reason,
      status: status,
      user: leave.user,
    };

    try {
      const response = await axios_instance.put(`${apiUrls.LOGIN_EMPLOYEE_LEAVE_APPLY}${id}/`, payload);
      if (response.status == 200) {
        setLeaveData((prevData) =>
          prevData.map((l) => (l.id === id ? { ...l, status } : l))
        );
        alert(`Leave has been ${status.toLowerCase()} successfully.`);
      } else {
        alert("Failed to update leave status.");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("An error occurred while updating the leave status.");
    }
  };

  const handleMarkAttendance = async () => {
    try {
      let response;

      if (attendanceStatus === 'loggedIn') {
        response = await axios_instance.post(apiUrls.ATTENDANCE); // Mark logout time
      } else {
        response = await axios_instance.post(apiUrls.ATTENDANCE); // Mark login time
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
        setUserAttendance(response.data)
        if (response.data.logout_time) {
          setAttendanceStatus('loggedOut');
        } else {
          setAttendanceStatus('loggedIn');
        }
      }
    } catch (error) {
      console.error("Error checking attendance status:", error);
    }
  };


  useEffect(() => {
    checkAttendanceStatus(); // attendance api
    hrDetails(); //hr details
    employeeLeaveGet() // employee leave request
    employeeDetails() // employee details
  }, []);

  return (
    <div className="min-h-screen space-y-8">
      {/* Profile Section */}
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
              src={hrDetail?.profilePic || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-white col-span-2">
            <h2 className="text-6xl font-extrabold leading-tight tracking-wide mb-2 capitalize">
              <span>{hrDetail?.firstname}</span> <span>{hrDetail?.lastname}</span>
            </h2>
            <p className="text-2xl font-light opacity-90 mb-4">
              Welcome to Dataclaps, your journey of growth and excellence begins here! 🚀
            </p>
            <p className="text-xl opacity-85">
              As a valued member of our team, your dedication drives us forward. Let's make an impact together!
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <p className="text-lg text-gray-700 font-medium">
            Office Time: <span className="font-bold text-indigo-600">11:00AM to 07:00PM</span>
          </p>

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

      {/*Details Cards */}
      <DetailsCard employeeDetail={employeeDetail} userAttendance={userAttendance}/>

      <div className="grid grid-cols-3">
      {/* AttendanceOverviewChart */}
      <div className="col-span-2">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">HR Attendance</h2>
      <p className="text-sm text-gray-500 mb-4">visual breakdown of the Your attendance today.</p>
      <EmpAttendanceChart attendanceStatus={attendanceStatus} />
      </div>
      {/* Announcement */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2"><TfiAnnouncement/>Announcements</h2>
          <p className="text-sm text-gray-500 mb-4">
            Stay updated with the latest company news and important updates. Check the employee attendance logs for detailed insights.
          </p>
      <Accordion />
      </div>
      </div>

      {/* MeetingSchedule */}
      <MeetingSchedule />

      {/* Absent today */}
      <AbsentToday userAttendance={userAttendance}/>

      {/* Leave request */}
      {leaveData?.length > 0 &&
        <div className="my-10">
          <h1 className="text-lg font-semibold text-gray-800 mb-3">Leave Request</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
            {leaveData.map((leave) => (
              <div
                key={leave.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Header: Leave Type and Status */}
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {leave.leave_type}
                  </h3>
                  <span
                    className={"px-3 py-1 text-sm font-medium rounded-md bg-yellow-200 text-yellow-800"}
                  >
                    {leave.status}
                  </span>
                </div>

                {/* Content: Leave Details */}
                <div className="p-6">
                  {/* User Email */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="text-base font-medium text-gray-800">
                      {leave.user_email}
                    </p>
                  </div>

                  {/* Leave Dates */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date:</p>
                      <p className="text-base font-medium text-gray-800">
                        {leave.start_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date:</p>
                      <p className="text-base font-medium text-gray-800">
                        {leave.end_date}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Reason:</p>
                    <p className="text-base font-medium text-gray-800">{leave.reason}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleStatusChange(leave.id, "Approved")}
                      className="w-full bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(leave.id, "Rejected")}
                      className="w-full bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }

    </div>
  );
};

export default HrDashboard;
