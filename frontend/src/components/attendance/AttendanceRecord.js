import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios_instance from "../../libs/interseptor";
import apiUrls from "../../libs/apiUrls";

const AttendanceRecord = ({attendanceStatus}) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.user_id;

  // Helper function to format time
  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes, seconds] = time.split(":");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios_instance.get(`${apiUrls.ATTENDANCE}`);
        setAttendanceRecords(response.data);
      } catch (err) {
        setError("Failed to fetch attendance records. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [attendanceStatus]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Attendance Record
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 animate-pulse">Loading attendance records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg text-center">
          No attendance records available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-base">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Login Time</th>
                <th className="px-6 py-4">Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="bg-white hover:bg-gray-100 transition duration-150"
                >
                  <td className="px-6 py-4 border-b border-gray-200">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {record.login_time_formatted}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {record.logout_time ? record.logout_time_formatted : "Not Logged Out Yet"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecord;
