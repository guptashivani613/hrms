import React, { useState, useEffect } from 'react';
import moment from "moment";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios_instance from '../../../libs/interseptor';
import apiUrls from '../../../libs/apiUrls';
import "./Salary.css";
import { notifySuccess, notifyError } from "../../../components/common/ToastMessage"

function SalaryDetailsComponent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSalaryAdd, setIsSalaryAdd] = useState(false)
  const [userDetails, setUserDetails] = useState([]);
  const [salaryUserDetails, setSalaryUserDetails] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [salaryId, setSalaryId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalSalary, setTotalSalary] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [paidStatus, setPaidStatus] = useState('false');
  const [paidDate, setPaidDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePaidAmountChange = (value) => {
    setPaidAmount(value);
    const balance = totalSalary - value;
    setBalanceAmount(balance > 0 ? balance : 0);
  };

  const handleFetchSalary = async () => {
    if (!employeeId || !salaryId || !fromDate || !toDate || !totalSalary || paidStatus === '' || !paymentDueDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        user: employeeId,
        salary: salaryId,
        from_date: fromDate,
        to_date: toDate,
        total_salary: totalSalary,
        paid_amount: paidAmount,
        balance_amount: balanceAmount,
        paid_status: paidStatus === 'true',
        paid_date: paidStatus === 'true' ? paidDate : null,
        payment_due_date: paymentDueDate,
      };

      const response = await axios_instance.post(apiUrls.MONTHLY_SALARY_STATUS, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 201) {
        notifySuccess("Monthly Salary Added Successfully!")
        setIsSalaryAdd(false)
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  //handle cancel
  const handleCancel = () => {
    setIsSalaryAdd(false)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios_instance.get(apiUrls.USER_FIND, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          const verifiedUsers = response.data.filter((user) => user.otp_verified === true);
          setUserDetails(verifiedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const fetchSalaryUser = async () => {
      try {
        const response = await axios_instance.get(apiUrls.ALL_EMPLOYEE_SALARY_DETAILS, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          setSalaryUserDetails(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
    fetchSalaryUser()
  }, []);

  return (
    <div className="">
      <div className="flex justify-end mb-4">
        {!isSalaryAdd && <button
          onClick={() => { setIsSalaryAdd(true) }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md transition duration-200"
        >
          <IoMdAddCircleOutline className="text-lg" />
          Add Monthly Salary
        </button>}
      </div>
      {
        isSalaryAdd ?
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="selectInput"
              >
                <option value="" disabled>Select Employee by Email</option>
                {userDetails.map((user) => (
                  <option key={user.id} value={user.id}>{user.email}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Salary ID <span className="text-red-500">*</span>
              </label>
              <select
                value={salaryId}
                onChange={(e) => setSalaryId(e.target.value)}
                className="selectInput"
              >
                <option value="" disabled>Select Salary Id by Email</option>
                {salaryUserDetails.map((user) => (
                  <option key={user.id} value={user.id}>{user.employee_email}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                From Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={fromDate ? new Date(fromDate) : null}
                onChange={(date) => setFromDate(date ? date.toISOString().split("T")[0] : "")}
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                To Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={toDate ? new Date(toDate) : null}
                onChange={(date) => setToDate(date ? date.toISOString().split("T")[0] : "")}
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Total Salary <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={totalSalary}
                onChange={(e) => setTotalSalary(e.target.value)}
                className="customTextInput"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Paid Amount
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => handlePaidAmountChange(e.target.value)}
                className="customTextInput"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Balance Amount
              </label>
              <input
                type="number"
                value={balanceAmount}
                readOnly
                className="customTextInput"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Due Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={paymentDueDate ? new Date(paymentDueDate) : null}
                onChange={(date) =>
                  setPaymentDueDate(date ? date.toISOString().split("T")[0] : "")
                }
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Paid Status <span className="text-red-500">*</span>
              </label>
              <select
                value={paidStatus}
                onChange={(e) => setPaidStatus(e.target.value)}
                className="selectInput"
              >
                <option value="false">Unpaid</option>
                <option value="true">Paid</option>
              </select>
            </div>

            {paidStatus === 'true' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Paid Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={paidDate ? new Date(paidDate) : null}
                  onChange={(date) => setPaidDate(date ? date.toISOString().split("T")[0] : "")}
                  dateFormat="yyyy-MM-dd"
                  className="customTextInput"
                  placeholderText="YYYY-MM-DD"
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="formCancelBtn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                onClick={handleFetchSalary}
                disabled={loading}
                className="formSubmitBtn"
              >
                {loading ? 'Submiting...' : 'Submit'}
              </button>
            </div>
          </div>
          :
          <div>
            <Salary />
          </div>
      }
    </div>
  );
}

export default SalaryDetailsComponent;


function Salary({ handleEdit }) {
  const [salaryData, setSalaryData] = useState([]);

  const getSalary = async () => {
    try {
      const response = await axios_instance.get(apiUrls.MONTHLY_SALARY_STATUS);
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
        {/* <SalarySearch setSalaryData={setSalaryData} /> */}
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
  <table className="w-full text-sm text-gray-500">
    <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <tr>
        <th className="py-4 px-4">ID</th>
        <th className="py-4 px-4">Name</th>
        <th className="py-4 px-4">Email</th>
        <th className="py-4 px-4">Department</th>
        <th className="py-4 px-4">From</th>
        <th className="py-4 px-4">To Date</th>
        <th className="py-4 px-4">Status</th>
        <th className="py-4 px-4">Paid</th>
        <th className="py-4 px-4">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {salaryData.length > 0 ? (
        salaryData.map((data, i) => {
          const person = data?.employee || data?.manager;
          return (
            <SalaryList
              key={i}
              data={data}
              getSalary={getSalary}
              salaryData={salaryData}
              setSalaryData={setSalaryData}
            />
          );
        })
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

function SalaryList({
  data,
  getSalary,
  salaryData,
  setSalaryData
}) {
  const { id: personId, employee, manager, from_date: fromDate, to_date: toDate, paid_status, paid_date: date } = data;
  const person = employee || manager;
  const [paidStatus, setPaidStatus] = useState(paid_status ? "1" : "0");
  const [paidDate, setPaidDate] = useState();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const login_id = storedUserData?.user_id;

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios_instance.delete(`${apiUrls.MONTHLY_SALARY_STATUS}${id}/`);
      setSalaryData(salaryData.filter((detail) => detail.id !== id));
    } catch (error) {
      console.error("Error deleting bank detail:", error);
    }
  };

  useEffect(() => {
    setPaidDate(paidStatus === "1" ? moment(new Date()).format("YYYY-MM-DD") : "");
  }, [paidStatus]);

  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-4">{personId}</td>
      <td className="py-3 px-4">{person ? `${person.firstname} ${person.lastname}` : "N/A"}</td>
      <td className="py-3 px-4">{person?.email}</td>
      <td className="py-3 px-4">{person?.department}</td>
      <td className="py-3 px-4">{fromDate}</td>
      <td className="py-3 px-4">{toDate}</td>
      <td className="py-3 px-4">{paidStatus === "1" ? "true" : "false"}</td>
      <td className="py-3 px-4">{date ? date : "-"}</td>
      <td className="w-10% p-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => handleDelete(personId)}
          className="text-red-500 hover:text-red-600 transition"
        >
          <RiDeleteBin5Line size={20} />
        </button>
      </td>
    </tr>
  );
}

