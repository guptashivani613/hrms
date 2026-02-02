import React, { useState, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios_instance from "../../../libs/interseptor";
import apiUrls from "../../../libs/apiUrls";
import {notifySuccess, notifyError} from "../../../components/common/ToastMessage"

const AddBankDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isBankAdd, setISBankAdd] = useState(false)
  const [bankDetails, setBankDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([])
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
    employee: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (!formData.account_holder_name.trim()) {
      newErrors.account_holder_name = "Account holder name is required.";
    }
    if (!formData.account_number.trim()) {
      newErrors.account_number = "Account number is required.";
    } else if (formData.account_number.length < 9 || formData.account_number.length > 18) {
      newErrors.account_number = "Account number must be between 9 and 18 digits.";
    }
    if (!formData.ifsc_code.trim()) {
      newErrors.ifsc_code = "IFSC code is required.";
    } else if (!ifscRegex.test(formData.ifsc_code)) {
      newErrors.ifsc_code = "Invalid IFSC code format.";
    }
    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required.";
    }
    // if (!formData.employee.trim()) {
    //   newErrors.employee = "Employee ID is required.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  //account details add
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        const response = await axios_instance.put(`${apiUrls.ADD_BANK_DETAILS}${userDetails[0]?.id}/`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        notifySuccess("Bank details updated successfully!"); 
      } else {
        const response = await axios_instance.post(apiUrls.ADD_BANK_DETAILS, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        notifySuccess("Bank details added successfully!");
      }
      setFormData({
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        bank_name: "",
        branch_name: "",
        employee: "",
      });
      setErrors({});
      setISBankAdd(false)
      setIsEditing(false)
      fetchBankDetails()
    } catch (error) {
      if (error.response && error.response.data) {
        console.warn(error)
        setErrors({ general: error.response.data.employee[0] || "Something went wrong." });
      } else {
        setErrors({ general: "Unable to connect to the server." });
      }
    }
  };

  // User id fetch
  const fetchUser = async () => {
    try {
      const response = await axios_instance.get(apiUrls.USER_FIND, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        const verifiedUsers = response.data.filter((user) => user.otp_verified === true)
        setUserDetails(verifiedUsers)
      }
    } catch (error) {
      console.error("Failed to get users:", error);
    }
  }

  // account details fetch
  const fetchBankDetails = async () => {
    try {
      const response = await axios_instance.get(apiUrls.ADD_BANK_DETAILS);
      setBankDetails(response.data);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios_instance.delete(`${apiUrls.ADD_BANK_DETAILS}${id}/`);
      setBankDetails(bankDetails.filter((detail) => detail.id !== id));
    } catch (error) {
      console.error("Error deleting bank detail:", error);
    }
  };

  //hadle edit
  const handleEdit = (detail) => {
    setISBankAdd(!isBankAdd)
    setIsEditing(true)
    setFormData({
      account_holder_name: detail?.account_holder_name,
      account_number: detail?.account_number,
      ifsc_code: detail?.ifsc_code,
      bank_name: detail?.bank_name,
      branch_name: detail?.branch_name,
      employee: detail?.employee,
    })
    setUserDetails([{
      id: detail?.id,
      email: detail?.employee_email
    }])
  }

  //handle cancel
  const handleCancel = () => {
    setFormData({
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      bank_name: "",
      branch_name: "",
      employee: "",
    });
    setISBankAdd(false)
    setIsEditing(false)
    fetchUser()
  }

  useEffect(() => {
    fetchUser()
    fetchBankDetails();
  }, [])

  return (
    <div className="">
      <div className="flex justify-end mb-4">
        {!isEditing && <button
          onClick={() => setISBankAdd(!isBankAdd)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md transition duration-200"
        >
          <IoMdAddCircleOutline className="text-lg" />
          Add Bank
        </button>}
      </div>

      {
        isBankAdd ?
          <form onSubmit={handleSubmit}>
            {/* Account Holder Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                  className="customTextInput"
                  placeholder="John"
                />
                {errors.account_holder_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.account_holder_name}</p>
                )}
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="customTextInput"
                  placeholder="000000000000"
                />
                {errors.account_number && (
                  <p className="text-red-600 text-sm mt-1">{errors.account_number}</p>
                )}
              </div>
            </div>

            {/* IFSC Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleChange}
                  className="customTextInput"
                  placeholder="XXXX0001234"
                />
                {errors.ifsc_code && (
                  <p className="text-red-600 text-sm mt-1">{errors.ifsc_code}</p>
                )}
              </div>

              {/* Bank Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="customTextInput"
                  placeholder="ICIC Bank"
                />
                {errors.bank_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.bank_name}</p>
                )}
              </div>
            </div>

            {/* Branch Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Branch Name
                </label>
                <input
                  type="text"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleChange}
                  className="customTextInput"
                  placeholder="ICICI Bank Ltd.,Delhi"
                />
              </div>

              {/* Employee */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  className="selectInput"
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
                {errors.employee && (
                  <p className="text-red-600 text-sm mt-1">{errors.employee}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="formCancelBtn"
                onClick={handleCancel}
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
          :
          <table className="w-full text-sm text-gray-500 border border-gray-200 shadow-md overflow-hidden rounded-lg">
        <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <tr>
            <th className="py-4 px-4">ID</th>
            <th className="py-4 px-4">Name</th>
            <th className="py-4 px-4">Account No</th>
            <th className="py-4 px-4">IFSC Code</th>
            <th className="py-4 px-4">Bank Name</th>
            <th className="py-4 px-4">Branch</th>
            <th className="py-4 px-4">Email</th>
            <th className="py-4 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bankDetails?.length > 0 ? (
            bankDetails.map((detail) => (
              <tr
                key={detail?.id}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="py-4 px-4">{detail?.id}</td>
                <td className="py-4 px-4">{detail?.account_holder_name}</td>
                <td className="py-4 px-4">{detail?.account_number}</td>
                <td className="py-4 px-4">{detail?.ifsc_code}</td>
                <td className="py-4 px-4">{detail?.bank_name}</td>
                <td className="py-4 px-4">{detail?.branch_name}</td>
                <td className="py-4 px-4">{detail?.employee_email}</td>
                <td className="py-4 px-4 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handleEdit(detail)}
                    className="text-yellow-500 hover:text-yellow-600 transition"
                  >
                    <MdOutlineModeEditOutline size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(detail.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <RiDeleteBin5Line size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      }
    </div>
  );
};

export default AddBankDetails;
