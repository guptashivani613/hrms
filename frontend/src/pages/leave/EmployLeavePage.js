import React from "react";
import LeaveBalanceComponent from "../../components/employee_component/leave/LeaveBalanceComponent";
import LeaveSubmission from "./LeaveSubmission";
import TabSwitch from "../../components/TabSwitch/TabSwitch"

const EmployLeavePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TabSwitch
        tabs={["Leave Balance", "Apply for Leave"]}
        components={[<LeaveBalanceComponent />, <LeaveSubmission />]}
      />
    </div>
  );
};

export default EmployLeavePage;
