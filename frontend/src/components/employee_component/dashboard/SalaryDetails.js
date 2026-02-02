import React from "react";
import { FaMoneyBillAlt, FaRegHeart, FaUserAlt, FaShieldAlt } from "react-icons/fa";

const SalaryDetails = ({ employee }) => {
  const {
    basicSalary = 3000,
    hra = 500,
    da = 300,
    pfContribution = 360,
    esiContribution = 150,
    bonus = 200,
    taxDeduction = 100,
    healthInsurance = 150,
  } = employee;

  // Calculations
  const grossSalary = basicSalary + hra + da;
  const netSalary = grossSalary - pfContribution - esiContribution - taxDeduction + bonus;
  const totalBenefits = hra + da + bonus + healthInsurance;

  return (
    <div className="max-w-5xl mx-aut p-6 ">
      <h3 className="text-3xl font-semibold text-indigo-700 mb-8 flex items-center space-x-2">
        <FaMoneyBillAlt className="text-4xl" />
        <span>Salary Details</span>
      </h3>

      {/* Salary Information */}
      <div className="space-y-6">
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm">
          <span className="text-lg font-semibold text-gray-700">Basic Salary:</span>
          <span className="text-lg text-indigo-600">${basicSalary}</span>
        </div>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">HRA (House Rent Allowance):</span>
          <span className="text-lg text-indigo-600">${hra}</span>
        </div>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">DA (Dearness Allowance):</span>
          <span className="text-lg text-indigo-600">${da}</span>
        </div>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">Bonus:</span>
          <span className="text-lg text-indigo-600">${bonus}</span>
        </div>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">Tax Deduction:</span>
          <span className="text-lg text-red-500">-${taxDeduction}</span>
        </div>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">Health Insurance:</span>
          <span className="text-lg text-indigo-600">${healthInsurance}</span>
        </div>

        {/* Gross Salary */}
        <div className="flex justify-between items-center py-4 px-6 bg-blue-100 rounded-lg shadow-sm mt-6">
          <span className="text-xl font-semibold text-gray-700">Gross Salary:</span>
          <span className="text-xl text-indigo-600">${grossSalary}</span>
        </div>

        {/* Deductions */}
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">PF Contribution:</span>
          <span className="text-lg text-red-500">-${pfContribution}</span>
        </div>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">ESI Contribution:</span>
          <span className="text-lg text-red-500">-${esiContribution}</span>
        </div>

        {/* Net Salary */}
        <div className="flex justify-between items-center py-4 px-6 bg-green-100 rounded-lg shadow-sm mt-6">
          <span className="text-xl font-semibold text-gray-700">Net Salary:</span>
          <span className="text-xl text-green-600">${netSalary}</span>
        </div>
      </div>

      {/* Total Benefits */}
      <div className="mt-8 p-6 bg-indigo-50 rounded-lg shadow-lg">
        <h4 className="text-xl font-semibold text-indigo-800 flex items-center space-x-2">
          <FaRegHeart className="text-2xl" />
          <span>Total Benefits</span>
        </h4>
        <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg shadow-sm mt-4">
          <span className="text-lg font-semibold text-gray-700">Total Allowances and Benefits:</span>
          <span className="text-lg text-indigo-600">${totalBenefits}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
