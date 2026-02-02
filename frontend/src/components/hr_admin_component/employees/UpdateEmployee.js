import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiUrls from "../../../libs/apiUrls";
import axios_instance from "../../../libs/interseptor";

const departmentData = {
  HR: ["HR Manager", "Recruitment Specialist", "HR Generalist", "Compensation and Benefits Analyst", "Training and Development Manager"],
  IT: ["Software Engineer", "IT Manager", "System Administrator", "Network Engineer", "Cybersecurity Analyst"],
  Finance: ["Financial Analyst", "CFO", "Accountant", "Investment Manager", "Budget Analyst"],
  Marketing: ["Marketing Manager", "Digital Marketing Specialist", "Brand Manager", "Content Strategist", "Social Media Manager"],
  Operations: ["Operations Manager", "Supply Chain Analyst", "Logistics Coordinator", "Quality Assurance Manager", "Project Manager"],
  "Business Development": ["Business Development Manager", "Sales Executive", "Strategic Partnerships Manager", "Account Manager", "Market Research Analyst"],
};

function UpdateEmployee({ isOpen,
   onClose, 
   emp_type, 
   emp_id, 
   emp_email,
   }) {
  const [userDetails, setUserDetails] = useState([]);
  const [file, setFile] = useState({});
  const [preview, setPreview] = useState(null);
  const [empDtls, setEmpDtls] = useState([])
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: emp_email,
    contact: "",
    gender: "",
    dob: "",
    address: "",
    department: "",
    designation: "",
    dateOfHired: "",
    dateOfJoined: "",
    active: true,
    user: emp_id,
  });

  const inputHandle = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandle = (e) => {
    const selectedFile = e.target.files[0];
    setFile({ ...file, [e.target.name]: selectedFile });

    // Generate a preview URL for the selected file
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(input).forEach((key) => {
      formData.append(key, input[key]);
    });

    if (file.profilePic) {
      formData.append("profilePic", file.profilePic);
    }

    const url = emp_type === "EMPLOYEE" ? apiUrls.EMPLOYEE_DETAILS_ADD : emp_type === "MANAGER" ? apiUrls.MANAGER_DETAILS_ADD : "not-found";
    
    try {
      const response = await axios_instance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        alert(`${emp_type} Added Successfully!`);
        resetHandle()
        onClose()
      }
    } catch (error) {
      console.error(`Failed`, error);
      alert(`Failed to add ${error.response.data.user[0]}. Please try again.`);
    }
  };

  const resetHandle = () => {
    setInput({
      firstname: "",
      lastname: "",
      email: "",
      contact: "",
      gender: "",
      dob: "",
      address: "",
      department: "",
      designation: "",
      dateOfHired: "",
      dateOfJoined: "",
      active: true,
      user: "",
    });
    setFile({});
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const url = apiUrls.USER_FIND
      try {
        const response = await axios_instance.get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const verifiedUsers = response.data.filter(
            (user) =>
              user.otp_verified === true &&
              user.type === emp_type
          );
          setUserDetails(verifiedUsers);
        }
      } catch (error) {
        console.error(`Failed to get ${emp_type.toLowerCase()}s:`, error);
      }
    };
    fetchUsers();
  }, [emp_type]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="p-4 h-[90vh] overflow-y-scroll bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-4">
          <h2>{emp_type} Registration Form</h2>
          <IoIosCloseCircleOutline onClick={() => onClose()} className="hover:text-red-500 cursor-pointer hover:text-2xl" />
        </div>
        <form className="space-y-4 text-left">
          <label className="block text-sm font-medium text-gray-700">
            Emp Id <span className="text-red-500">*</span>
          </label>
          <select
            name="user"
            value={emp_id}
            onChange={inputHandle}
            className="selectInput"
            disabled
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstname"
                value={input.firstname}
                onChange={inputHandle}
                className="customTextInput"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                value={input.lastname}
                onChange={inputHandle}
                className="customTextInput"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={inputHandle}
                className="customTextInput"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="contact"
                value={input.contact}
                onChange={inputHandle}
                className="customTextInput"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={input.gender === "male"}
                    onChange={inputHandle}
                  />
                  <span className="ml-2 text-sm">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={input.gender === "female"}
                    onChange={inputHandle}
                  />
                  <span className="ml-2 text-sm">Female</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="transgender"
                    checked={input.gender === "transgender"}
                    onChange={inputHandle}
                  />
                  <span className="ml-2 text-sm">Transgender</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={input.dob ? new Date(input.dob) : null}
                onChange={(date) => setInput({ ...input, dob: date ? date.toISOString().split("T")[0] : "" })}
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={input.department}
                onChange={inputHandle}
                className="selectInput"
              >
                <option value="">Select Department</option>
                {
                  Object.keys(departmentData).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Designation <span className="text-red-500">*</span>
              </label>
              <select
                name="designation"
                value={input.designation}
                onChange={inputHandle}
                className="selectInput"
                disabled={!input.department}
              >
                <option value="">Select Designation</option>
                {input.department &&
                  departmentData[input.department].map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Hired <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={input.dateOfHired ? new Date(input.dateOfHired) : null}
                onChange={(date) => setInput({ ...input, dateOfHired: date ? date.toISOString().split("T")[0] : "" })}
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Joined <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={input.dateOfJoined ? new Date(input.dateOfJoined) : null}
                onChange={(date) => setInput({ ...input, dateOfJoined: date ? date.toISOString().split("T")[0] : "" })}
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={input.address}
              onChange={inputHandle}
              className="customTextAreaInput"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            {/* Preview Section */}
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover border border-gray-300"
                />
              </div>
            )}
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={fileHandle}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:px-4 file:py-2 file:text-gray-600 file:shadow-sm focus:outline-none"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              onClick={submitHandle}
              className="formSubmitBtn"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmployee;
