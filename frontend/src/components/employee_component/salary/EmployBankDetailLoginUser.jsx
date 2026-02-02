import React, { useEffect, useState } from 'react';
import apiUrls from '../../../libs/apiUrls';
import axios_instance from '../../../libs/interseptor';
import { FaRegIdCard, FaRegBuilding, FaRegCreditCard } from 'react-icons/fa'; // Using React Icons
import { CiBank } from "react-icons/ci";

const EmployBankDetailLoginUser = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the salary data from API
  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios_instance.get(apiUrls.LOGIN_EMP_BANK_DETAILS);
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }

        setSalaryData(response?.data);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;

  const bankDetails = salaryData;

  if (!salaryData) return <div className="text-center text-xl">No bank details found.</div>;

  return (
    <div>
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Bank Details</h2>

      <div className="space-y-6">
        {/* Account Holder Name */}
        <div className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border">
          <div className="flex items-center space-x-3">
            <FaRegIdCard className="text-indigo-600 text-2xl" />
            <span className="text-sm font-semibold text-gray-600">Account Holder Name</span>
          </div>
          <span className="text-lg text-gray-900 font-medium">{bankDetails?.account_holder_name}</span>
        </div>

        {/* Account Number */}
        <div className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border">
          <div className="flex items-center space-x-3">
            <FaRegCreditCard className="text-indigo-600 text-2xl" />
            <span className="text-sm font-semibold text-gray-600">Account Number</span>
          </div>
          <span className="text-lg text-gray-900 font-medium">{bankDetails?.account_number}</span>
        </div>

        {/* IFSC Code */}
        <div className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border">
          <div className="flex items-center space-x-3">
            <FaRegBuilding className="text-indigo-600 text-2xl" />
            <span className="text-sm font-semibold text-gray-600">IFSC Code</span>
          </div>
          <span className="text-lg text-gray-900 font-medium">{bankDetails?.ifsc_code}</span>
        </div>

        {/* Bank Name */}
        <div className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border">
          <div className="flex items-center space-x-3">
            <CiBank className="text-indigo-600 text-2xl" />
            <span className="text-sm font-semibold text-gray-600">Bank Name</span>
          </div>
          <span className="text-lg text-gray-900 font-medium">{bankDetails?.bank_name}</span>
        </div>

        {/* Branch Name */}
        <div className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border">
          <div className="flex items-center space-x-3">
            <FaRegBuilding className="text-indigo-600 text-2xl" />
            <span className="text-sm font-semibold text-gray-600">Branch Name</span>
          </div>
          <span className="text-lg text-gray-900 font-medium">{bankDetails?.branch_name || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployBankDetailLoginUser;
