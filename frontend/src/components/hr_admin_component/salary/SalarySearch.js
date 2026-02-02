import React, { useState } from "react";
import "./SalarySearch.css";
import apiUrls from '../../../libs/apiUrls';
import axios_instance from "../../../libs/interseptor";

function SalarySearch({ setSalaryData }) {
  const [input, setInput] = useState({
    paidStatus: "",
    fullName: "",
    department: "",
  });
  
  const submitHandle = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("accessToken");
    const queryParams = new URLSearchParams(input).toString();
  
    try {
      const response = await axios_instance.get(
        `${apiUrls.MONTHLY_SALARY_STATUS}${queryParams ? `?${queryParams}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "Fetched Salary Data");
      setSalaryData(response.data);
    } catch (error) {
      console.error("Failed to fetch salary details:", error);
    }
  };
  
  return (
    <form className="salary-search-form" onSubmit={submitHandle}>
      <div className="form-group">
        <label htmlFor="fullName">Employee Name:</label>
        <input
          type="text"
          id="fullName"
          placeholder="Search Employee"
          value={input.fullName}
          className="customTextInput"
          onChange={(e) => setInput({ ...input, fullName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          placeholder="Enter Department"
          value={input.department}
          className="customTextInput"
          onChange={(e) => setInput({ ...input, department: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="paidStatus">Salary Status:</label>
        <select
          id="paidStatus"
          value={input.paidStatus}
          className="selectInput"
          onChange={(e) => setInput({ ...input, paidStatus: e.target.value })}
        >
          <option value="">All</option>
          <option value="1">Paid</option>
          <option value="0">Unpaid</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">
        Search
      </button>
    </form>
  );
}

export default SalarySearch;
