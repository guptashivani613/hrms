import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import TabSwitch from "../../TabSwitch/TabSwitch";
import AddSalary from "../salary/AddSalary";
import AddEmployee from "./AddEmployee";
import UpdateEmployee from "./UpdateEmployee";

const EmployeeManager = () => {
  const history = useHistory()
  const handleBack = ()=>{
    history.push("/hr/view-employees");
  }
  return (
    <div>
      <TabSwitch
        tabs={["Register New User"]}
        components={[<AddEmployee handleBack={handleBack}/>]}
      />
    </div>
  );
};

export default EmployeeManager;
