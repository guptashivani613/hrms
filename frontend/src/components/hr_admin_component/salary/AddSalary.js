import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import apiUrls from "../../../libs/apiUrls";
import axios_instance from "../../../libs/interseptor";
import {notifySuccess, notifyError} from "../../../components/common/ToastMessage"

function AddSalary() {
  const history = useHistory();
  const [isSalaryAdd, setIsSalaryAdd] = useState(false)
  const [isSalaryEdit, setIsSalaryEdit] = useState(false)
  const [salaryId, setSalaryId] = useState(0)
  const [userDetails, setUserDetails] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [input, setInput] = useState({
    employee: "",
    ppa: 0,
    monthly_salary: 0,
    basic_da: 0,
    hra: 0,
    conveyance: 0,
    pf: 0,
    esic: 0,
    professional_tax: 0,
    net_salary: 0,
    pan_card_number: "",
    bank_details: "",
  });

  const inputHandle = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    
  };

  const submitHandle = async (e) => {
    e.preventDefault();
  
    try {
      let payload;
      if (!isSalaryEdit) {
        payload = { ...input };
        payload.employee_id = payload.employee; 
        payload.bank_details_id = payload.bank_details;
        delete payload.employee;
        delete payload.bank_details;
      } else {
        payload = input;
      }

      let response;
      if (isSalaryEdit) {
        response = await axios_instance.put(
          `${apiUrls.ALL_EMPLOYEE_SALARY_DETAILS}${salaryId}/`,
          payload
        );
      } else {
        response = await axios_instance.post(
          apiUrls.ALL_EMPLOYEE_SALARY_DETAILS,
          payload
        );
      }

      if (response.status === 201 || response.status === 200) {
        const successMessage = isSalaryEdit
          ? "Employee salary updated successfully!"
          : "Employee salary added successfully!";
        notifySuccess(successMessage);
  
        setIsSalaryAdd(false); 
        setIsSalaryEdit(false)
        setSalaryId(0)
        handleClearInput();
      } else {
        
      }
    } catch (error) {
      console.error("Failed to submit salary details:", error);
    }
  };
  

  const handleClearInput = ()=>{
    setInput({
      employee: "",
      ppa: 0,
      monthly_salary: 0,
      basic_da: 0,
      hra: 0,
      conveyance: 0,
      pf: 0,
      esic: 0,
      professional_tax: 0,
      net_salary: 0,
      pan_card_number: "",
      bank_details: "",
    })
  }

  const handleEdit = (employee)=>{
    setSalaryId(employee.id)
    setIsSalaryEdit(true)
    setIsSalaryAdd(true)
    setInput({
      employee: employee.employee ,
      ppa: employee.ppa,
      monthly_salary: employee.monthly_salary,
      basic_da: employee.basic_da,
      hra: employee.hra,
      conveyance: employee.conveyance,
      pf: employee.pf,
      esic: employee.esic,
      professional_tax: employee.professional_tax,
      net_salary: employee.net_salary,
      pan_card_number: employee.pan_card_number ,
      bank_details: employee.bank_details.id,
    })
  }
  //handle cancel
  const handleCancel = () => {
    setSalaryId(0)
    setIsSalaryAdd(false)
    setIsSalaryEdit(false)
    handleClearInput()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios_instance.get(apiUrls.USER_FIND, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (userResponse.status === 200) {
          const verifiedUsers = userResponse.data.filter((user) => user.otp_verified === true);
          setUserDetails(verifiedUsers);
        }

        const bankResponse = await axios_instance.get(apiUrls.ADD_BANK_DETAILS, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (bankResponse.status === 200) {
          setBankDetails(bankResponse.data);
        }
      } catch (error) {
        console.error("Failed to get data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {!isSalaryAdd && <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsSalaryAdd(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md transition duration-200"
        >
          <IoMdAddCircleOutline className="text-lg" />
          Add Salary
        </button>
      </div>}
      {
        isSalaryAdd ?
          <div className="">
            <form onSubmit={submitHandle} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Employee Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employee"
                    value={input.employee}
                    onChange={inputHandle}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>
                      Select Employee by Email
                    </option>
                    {userDetails.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bank Details Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Details <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bank_details"
                    value={input.bank_details}
                    onChange={inputHandle}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>
                      Select Bank Details
                    </option>
                    {bankDetails.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.employee_email} - {bank.bank_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "PPA", name: "ppa" },
                  { label: "Monthly Salary", name: "monthly_salary" },
                  { label: "Basic Salary", name: "basic_da" },
                  { label: "HRA", name: "hra" },
                  { label: "Conveyance", name: "conveyance" },
                  { label: "PF", name: "pf" },
                  { label: "ESIC", name: "esic" },
                  { label: "Professional Tax", name: "professional_tax" },
                  { label: "Net Salary", name: "net_salary" },
                ].map(({ label, name }) => (
                  <InputField
                    key={name}
                    label={label}
                    name={name}
                    value={input[name]}
                    onChange={inputHandle}
                    placeholder={`Enter ${label}`}
                  />
                ))}

                {/* Add PAN Card Number Field */}
                <InputField
                  label="PAN Card Number"
                  name="pan_card_number"
                  value={input.pan_card_number}
                  onChange={inputHandle}
                  placeholder="ABCDE1234F"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  type="button"
                  className="formCancelBtn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="formSubmitBtn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          :
          <div>
            <SalaryDetails handleEdit={handleEdit}/>
          </div>
      }
    </div>
  );
}

// Reusable InputField Component
const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="customTextInput"
    />
  </div>
);

function SalaryDetails({handleEdit}) {
  const [employeesData, setEmployeesData] = useState([]);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios_instance.delete(`${apiUrls.ALL_EMPLOYEE_SALARY_DETAILS}${id}/`);
      setEmployeesData(employeesData.filter((detail) => detail.id !== id));
    } catch (error) {
      console.error("Error deleting bank detail:", error);
    }
  };

  const fetchEmployeesSalaryDetails = async () => {
    try {
      const response = await axios_instance.get(apiUrls.ALL_EMPLOYEE_SALARY_DETAILS);
      setEmployeesData(response.data);
    } catch (error) {
      console.error("Error fetching employees' salary details:", error);
    }
  };

  useEffect(() => {
    fetchEmployeesSalaryDetails();
  }, []);

  return (
    <div>
      <div>
        {/* <SalarySearch setEmployeesData={setEmployeesData} /> */}
        {/* Responsive Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
  <table className="w-full text-sm text-gray-500">
    <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <tr>
        <th className="py-4 px-4">E_ID</th>
        <th className="py-4 px-4">PPA</th>
        <th className="py-4 px-4">Salary</th>
        <th className="py-4 px-4">DA</th>
        <th className="py-4 px-4">HRA</th>
        <th className="py-4 px-4">Conveyance</th>
        <th className="py-4 px-4">PF</th>
        <th className="py-4 px-4">ESIC</th>
        <th className="py-4 px-4">Professional Tax</th>
        <th className="py-4 px-4">Net Salary</th>
        <th className="py-4 px-4">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {employeesData?.length > 0 ? (
        employeesData.map((employee) => (
          <tr
            key={employee?.id}
            className="hover:bg-blue-50 transition-colors duration-200"
          >
            <td className="py-4 px-4">{employee?.employee}</td>
            <td className="py-4 px-4">{employee?.ppa}</td>
            <td className="py-4 px-4">{employee?.monthly_salary}</td>
            <td className="py-4 px-4">{employee?.basic_da}</td>
            <td className="py-4 px-4">{employee?.hra}</td>
            <td className="py-4 px-4">{employee?.conveyance}</td>
            <td className="py-4 px-4">{employee?.pf}</td>
            <td className="py-4 px-4">{employee?.esic}</td>
            <td className="py-4 px-4">{employee?.professional_tax}</td>
            <td className="py-4 px-4">{employee?.net_salary}</td>
            <td className="py-4 px-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => handleEdit(employee)}
                className="text-yellow-500 hover:text-yellow-600 transition"
              >
                <MdOutlineModeEditOutline size={20} />
              </button>
              <button
                onClick={() => handleDelete(employee.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <RiDeleteBin5Line size={20} />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="11" className="text-center py-4 text-gray-500">
            No Records Found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
}

export default AddSalary;

