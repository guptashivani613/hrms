import React, { useEffect } from "react";
import HrDashboard from "./HrDashboard";
import Cookies from 'js-cookie';
import EmployDashboard from "../../dashboard/EmployDashboard";

const Dashboard = ({ employee = {} }) => {
  const userType = Cookies.get('userType');
  useEffect(() => {
    localStorage.setItem('tab', 'dashboard');
  }, []);

  return (
    <>
    {/* <EmployeeNavbar/> */}
    <div className="min-h-screen flex flex-col">
    <main className="flex-1 flex flex-col lg:flex-row">
      {/* Main Content */}
      <section className="flex-1 p-6">
        {userType==='hr' 
          ? <HrDashboard employee={employee} />
          : <EmployDashboard />
        } 
      </section>
    </main>
  </div>
  </>
  );
};

export default Dashboard;
