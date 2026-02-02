import React, { useState } from "react";
import { LiaDownloadSolid } from "react-icons/lia";
import apiUrls from "../../../libs/apiUrls";
import axios_instance from "../../../libs/interseptor";
import PayslipLoginUser from "./PayslipLoginUser";
import moment from "moment";

const SearchPayslip = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: "",
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

    if (!filters.month) {
      setError("Month field is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios_instance.get(
        `${apiUrls.LOGIN_EMP_ALL_SALARY_PAYSLIP}?month=${filters.month}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch salary data");
      }

      const data = response.data;
      const isEmployeePresent = data?.employee?.user;
      const isManagerPresent = data?.manager?.user;
      const person = isEmployeePresent ? data?.employee : isManagerPresent ? data?.manager : {};
      const salary_month = moment(data.from_date).format('MMMM YYYY');

      const formattedData = {
        employeeDetails: {
          name: `${person?.firstname || "N/A"} ${person?.lastname || "N/A"}`,
          id: `DC042024${person?.id || "N/A"}`,
          designation: person?.designation || "N/A",
          department: person?.department || "N/A",
          joiningDate: person?.dateOfJoined || "N/A",
          bankAccount: data?.salary?.bank_details?.account_number || "N/A",
          pan: data?.salary?.pan_card_number || "N/A",
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
      setError(
        err?.response?.data?.error || err?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Monthly Payslip
      </h1>

      <form onSubmit={handleSearch} className="flex justify-center items-end gap-4 mb-6">
        <div className="col-span-2">
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Month
          </label>
          <input
            type="month"
            id="month"
            name="month"
            value={filters.month}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-gray-600 my-5">Loading...</p>}
      {error && <p className="text-center text-red-500 my-5">Error: {error}</p>}

      {salaryData ? (
        <div className="">
          <PayslipLoginUser salaryData={salaryData} />
        </div>
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

export default SearchPayslip;
