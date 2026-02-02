import React, { useState } from "react";
import { LiaDownloadSolid } from "react-icons/lia";
import apiUrls from "../../../libs/apiUrls";
import axios_instance from "../../../libs/interseptor";
import SalarySlip from "./SalarySlip";
import moment from "moment";

const DownloadPayslip = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: "",
    employee: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!filters.month || !filters.employee) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios_instance.get(
        `${apiUrls.MONTHLY_PAYSLIP}?month=${filters.month}&email=${filters.employee}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch salary data");
      }

      const data = response.data;
      const isEmployeePresent = data.employee?.user
      const isManagerPresent = data.manager?.user
      const person = isEmployeePresent ? data.employee :isManagerPresent ? data.manager : {};
      const salary_month = moment(data.from_date).format('MMMM YYYY');

      const formattedData = {
        employeeDetails: {
          name: `${person?.firstname || "N/A"} ${person?.lastname || "N/A"}`,
          id: `DC042024${person?.id || "N/A"}`,
          designation: person?.designation || "N/A",
          department: person?.department || "N/A",
          joiningDate: person?.dateOfJoined || "N/A",
          bankAccount: data?.salary?.bank_details?.account_number || "N/A",
          pan: data?.salary?.pan_card_number|| "N/A",
        },
        salaryDetails: {
          month: salary_month,
          location: "Gurugram",
          totalEarnings: data.total_salary || 0,
          totalDeductions:
            (data.salary?.pf || 0) +
            (data.salary?.esic || 0) +
            (data.salary?.professional_tax || 0),
          netPay: data.salary?.net_salary || 0,
        },
        earnings: [
          { name: "Basic Salary", amount: data.salary?.basic_da || 0 },
          { name: "House Rent Allowance (HRA)", amount: data.salary?.hra || 0 },
          { name: "Conveyance", amount: data.salary?.conveyance || 0 },
        ],
        deductions: [
          { name: "Provident Fund", amount: data.salary?.pf || 0 },
          { name: "ESIC", amount: data.salary?.esic || 0 },
          { name: "Professional Tax", amount: data.salary?.professional_tax || 0 },
        ],
      };

      setSalaryData(formattedData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Search Employee Payslip
      </h1>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <input
            type="month"
            id="month"
            name="month"
            value={filters.month}
            onChange={handleInputChange}
            className="customTextInput"
            required
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Email
          </label>
          <input
            type="text"
            id="employee"
            name="employee"
            placeholder="Employee Name or ID"
            value={filters.employee}
            onChange={handleInputChange}
            className="customTextInput"
            required
          />
        </div>

        <div className="flex-none mt-4 sm:mt-0">
          <button
            type="submit"
            className="formSubmitBtn"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {salaryData ? (
          <SalarySlip salaryData={salaryData} />
      ) : (
        !loading &&
        !error && (
          <p className="text-sm text-gray-500 text-center">
            No results found. Use the search above to find payslips.
          </p>
        )
      )}
    </div>
  );
};

export default DownloadPayslip;
