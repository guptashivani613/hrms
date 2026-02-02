import React, { useEffect, useState } from "react";
import moment from "moment";
import "./Salary.css";
import SalarySearch from "./SalarySearch";
import axios_instance from "../../../libs/interseptor";
import apiUrls from "../../../libs/apiUrls";

function Salary() {
  const [salaryData, setSalaryData] = useState([]);

  const getSalary = async () => {
    try {
      const response = await axios_instance.get(apiUrls.MONTHLY_SALARY_STATUS);
      console.log(response.data, "Fetched Salary Data");
      setSalaryData(response.data);
    } catch (error) {
      console.error("Failed to fetch salary details:", error);
    }
  };

  useEffect(() => {
    getSalary();
  }, []);

  return (
    <div>
      <div>
        {/* <SalarySearch setSalaryData={setSalaryData} /> */}
        <table className="w-full mt-6 text-sm text-left text-gray-500 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-200 text-gray-700">
            <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">From Date</th>
            <th className="py-3 px-4">To Date</th>
            <th className="py-3 px-4">Paid Status</th>
            <th className="py-3 px-4">Paid Date</th>
            <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.length > 0 ? (
              salaryData.map((data, i) => {
                const person = data?.employee || data?.manager;
                return(
                  <SalaryList
                  key={i}
                  personId={data.id}
                  name={`${person?.firstname} ${person?.lastname}`}
                  email={person?.email}
                  department={person?.department}
                  fromDate={data?.from_date}
                  toDate={data?.to_date}
                  status={data?.paid_status}
                  date={data?.paid_date}
                  getSalary={getSalary}
                />
              )})
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Salary;

function SalaryList({
  personId,
  name,
  email,
  department,
  fromDate,
  toDate,
  status,
  date,
  getSalary,
}) {
  const [paidStatus, setPaidStatus] = useState(status ? "1" : "0");
  const [paidDate, setPaidDate] = useState();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const login_id = storedUserData?.user_id
  
  const updateHandle = async() => {
    try {
      const payload = { paidStatus, paidDate }
      const url = `${apiUrls.MONTHLY_SALARY_STATUS}${login_id}/`;
      const response = await axios_instance.put(url, payload);
      console.log(response,"fsa")
      if(response.status==200){
        console.log("Salary data updated successfully:", response.data);
        getSalary()
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Failed to update salary data:", error.response || error.message);
    }
  };

  useEffect(() => {
    setPaidDate(paidStatus === "1" ? moment(new Date()).format("YYYY-MM-DD") : "");
  }, [paidStatus]);

  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-4">{personId}</td>
      <td className="py-3 px-4">{name}</td>
      <td className="py-3 px-4">{email}</td>
      <td className="py-3 px-4">{department}</td>
      <td className="py-3 px-4">{fromDate}</td>
      <td className="py-3 px-4">{toDate}</td>
      <td className="py-3 px-4">
        <select
          value={paidStatus}
          onChange={(e) => setPaidStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-1 focus:ring-2 focus:ring-blue-400"
        >
          <option value="1">Paid</option>
          <option value="0">Unpaid</option>
        </select>
      </td>
      <td className="py-3 px-4">{date}</td>
      <td className="py-3 px-4">
        <button
          onClick={updateHandle}
          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm"
        >
          Update
        </button>
      </td>
    </tr>
  );
}
