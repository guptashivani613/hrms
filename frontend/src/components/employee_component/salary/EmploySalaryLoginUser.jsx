import React, { useEffect, useState } from "react";
import axios_instance from "../../../libs/interseptor";
import apiUrls from "../../../libs/apiUrls";
import { FaRegIdCard } from "react-icons/fa"; // Example of icons

const EmploySalaryLoginUser = () => {
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        const response = await axios_instance.get(apiUrls.LOGIN_EMP_SALARY);
        setSalaryDetails(response?.data);
      } catch (err) {
        setError("Failed to fetch salary details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryDetails();
  }, []);

  const darkColors = [
    "bg-gradient-to-r from-blue-800 to-indigo-700",
    "bg-gradient-to-r from-green-800 to-teal-700",
    "bg-gradient-to-r from-purple-800 to-pink-700",
    "bg-gradient-to-r from-red-800 to-yellow-700",
  ];

  const getRandomDarkColor = () => darkColors[Math.floor(Math.random() * darkColors.length)];

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div>
      {salaryDetails && (
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8">Salary Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "PPA", value: salaryDetails.ppa || 0 },
              { label: "Monthly Salary", value: salaryDetails.monthly_salary || 0 },
              { label: "Basic Salary", value: salaryDetails.basic_da || 0},
              { label: "HRA", value: salaryDetails.hra || 0},
              { label: "Conveyance", value: salaryDetails.conveyance || 0},
              { label: "PF", value: salaryDetails.pf || 0},
              { label: "ESIC", value: salaryDetails.esic || 0},
              { label: "Professional Tax", value: salaryDetails.professional_tax || 0},
              { label: "Net Salary", value: salaryDetails.net_salary || 0},
              { label: "PAN Card Number", value: salaryDetails.pan_card_number || "N/A", icon: <FaRegIdCard /> },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-5 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ${getRandomDarkColor()}`}
              >
                <div className="flex items-center space-x-4">
                  {item.icon && <span className="text-white text-2xl">{item.icon}</span>}
                  <span className="font-semibold text-lg text-white">{item.label}:</span>
                </div>
                <span className="text-white font-semibold text-xl">
                  ₹ {item.value} {/* Use ₹ symbol for Rupees */}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploySalaryLoginUser;
