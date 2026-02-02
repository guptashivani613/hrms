import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios_instance from "../../libs/interseptor";
import apiUrls from "../../libs/apiUrls";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmpAttendanceChart = ({attendanceStatus}) => {
  const [totalHours, setTotalHours] = useState(0);
  const [productionHours, setProductionHours] = useState(0);
  const [punchInTime, setPunchInTime] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios_instance.get(`${apiUrls.ATTENDANCE}`);
        const data = response.data;

        // Filter data for today's date
        const today = new Date().toISOString().split("T")[0];
        const todayAttendance = data.find((entry) => entry.date === today);

        if (todayAttendance) {
          // Calculate production hours
          const loginTime = new Date(todayAttendance.login_time);
          const logoutTime = todayAttendance.logout_time
            ? new Date(todayAttendance.logout_time)
            : new Date(); // Use current time if logout_time is null

          const diffInMs = logoutTime - loginTime;
          const hoursWorked = diffInMs / (1000 * 60 * 60);

          setPunchInTime(loginTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          setTotalHours(9); // Assuming a standard workday of 9 hours
          setProductionHours(hoursWorked.toFixed(2)); // Convert to hours and round off
        } else {
          console.warn("No attendance data available for today.");
          setTotalHours(9); // Default total hours
          setProductionHours(0); // Default production hours
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [attendanceStatus]);

  const remainingHours = totalHours - productionHours;

  const chartData = {
    labels: ["Production", "Remaining Time"],
    datasets: [
      {
        data: [productionHours, remainingHours],
        backgroundColor: ["#4caf50", "#e0e0e0"], // Green for production, Gray for remaining
        hoverBackgroundColor: ["#66bb6a", "#bdbdbd"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: "70%", // Makes the chart look like a donut
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} hrs`,
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        {/* <h3 className="text-2xl font-semibold">Attendance</h3> */}
        <p className="text-sm text-gray-600 mt-2">
          Punch In at {punchInTime || "N/A"}
        </p>
        <Doughnut data={chartData} options={chartOptions} />
        <div className="mt-4">
          <p className="text-xl font-medium">Total Hours: {totalHours} hrs</p>
          <p className="text-lg text-gray-700">Production: {productionHours} hrs</p>
        </div>
      </div>
    </div>
  );
};

export default EmpAttendanceChart;
