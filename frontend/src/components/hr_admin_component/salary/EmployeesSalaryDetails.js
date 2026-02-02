import React from "react";
import TabSwitch from "../../TabSwitch/TabSwitch";
import Salary from "./Salary";
import AddSalary from "./AddSalary";
import MonthlySalaryAdd from "./MonthlySalaryAdd";
import DownloadPayslip from "./DownloadPaysleep";
import AddBankDetails from "./AddBankDetails";

const EmployeesSalaryDetails = () => {
  return (
    <div className="min-h-screen">
      <TabSwitch
        tabs={["Add Bank", "Add Salary", "Add Monthly Salary", "Payslip"]}
        components={[<AddBankDetails/> ,  <AddSalary/>, <MonthlySalaryAdd/>, <DownloadPayslip/>]}
      />
    </div>
  )
}

export default EmployeesSalaryDetails
