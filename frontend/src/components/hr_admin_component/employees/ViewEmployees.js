import React, { useState, useEffect } from "react";
import TotalEmployees from "./TotalEmployees";
import EmployeesTable from "./EmployeesTable";
import axios_instance from "../../../libs/interseptor";
import apiUrls from "../../../libs/apiUrls";
import { useHistory } from "react-router-dom";

function ViewEmployees() {
  const [employees, setEmployees] = useState([]);
  const [hrs,setHrs] = useState([]);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  // const token = localStorage.getItem("accessToken");
  const history = useHistory()

  useEffect(() => {
    const abc = async () => {
      try {
        const response = await axios_instance.get(apiUrls.USER_FIND);
        setUsers(response.data)
        const emp = response.data.filter((el)=>el.type =='EMPLOYEE' && el.otp_verified)
        const hr = response.data.filter((el)=>el.type =='HR' && el.otp_verified)
        const mngr = response.data.filter((el)=>el.type =='MANAGER' && el.otp_verified)
        setEmployees(emp);
        setHrs(hr)
        setManagers(mngr)
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch salary details:", error);
        setIsLoading(false);
      }
    }
    abc()
  }, []);
  
  return (
    <div className="p-6">
      <div className="flex justify-end">
        <button           
          onClick={() => {
            history.push("/hr/add-employee");
          }} 
          className="flex items-center gap-2 rounded-3xl bg-blue-400 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-blue-400 focus:shadow-none active:bg-blue-400 hover:bg-blue-500 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        >
          Add Employee
        </button>
     </div>
      <div className="flex gap-3">
        <TotalEmployees title="Employee" count={employees?.length} />
        <TotalEmployees title="HR" count={hrs?.length} />
        <TotalEmployees title="Manager" count={managers?.length} />
      </div>

      <div className="employee-table">
        <EmployeesTable employees={users} setEmployees={setEmployees} isLoading={isLoading} setIsLoading={setIsLoading}/>
        {/* <EmployeesTable/> */}
      </div>
    </div>
  );
}
export default ViewEmployees;
