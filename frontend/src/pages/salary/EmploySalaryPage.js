import React from 'react'
import TabSwitch from '../../components/TabSwitch/TabSwitch';
import EmploySalaryLoginUser from '../../components/employee_component/salary/EmploySalaryLoginUser'
import EmployBankDetailLoginUser from '../../components/employee_component/salary/EmployBankDetailLoginUser';
import SearchPayslip from '../../components/employee_component/salary/SearchPayslip';

const EmploySalaryPage = () => {
  return (
    <div className="min-h-screen bg-white">
    <TabSwitch
      tabs={["Salary","Bank Details", "Payslip"]}
      components={[<EmploySalaryLoginUser/>, <EmployBankDetailLoginUser/>, <SearchPayslip/> ]}
    />
  </div>
  )
}

export default EmploySalaryPage