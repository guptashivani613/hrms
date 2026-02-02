import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaEnvelope, FaPhone, FaBuilding, FaUserTie, FaIdBadge } from 'react-icons/fa';
import { MdDateRange, MdLocationOn, MdPerson } from 'react-icons/md'
import { IoMaleFemaleOutline } from "react-icons/io5";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import Cookies from 'js-cookie';
import axios_instance from "../../libs/interseptor";
import * as URLS from "../../libs/apiUrls";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ErrorMessage from "../common/ErrorMessage";
import { notifySuccess } from "../common/ToastMessage";

const PersonalInformation = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [employee, setEmployee] = useState({});
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [department, setDepartment] = useState("");
    const [dob, setDob] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [designation, setDesignation] = useState("HR");
    const [dateOfHired, setDateOfHired] = useState("");
    const [dateOfJoined, setDateOfJoined] = useState("");
    const [profileImgPreview, setProfileImgPreview] = useState(null);
    const [error, setError] = useState("")
    const userType = Cookies.get('userType')

    const sectionTitle = "text-xl font-semibold text-gray-800 flex items-center";
    const contactItem = "flex items-center gap-2";
    const iconStyle = "text-blue-400 text-lg"; // Unified icon style
    const labelStyle = "text-sm font-medium text-gray-600";
    const valueStyle = "text-gray-600 font-semibold";

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImg(file);
            setProfileImgPreview(URL.createObjectURL(file));
        }
    };

    const get_profile = async () => {
        try {
            // const response = await axios_instance.get(URLS.HR_DETAILS);
            let response;
            if (userType === 'hr') {
                response = await axios_instance.get(URLS.HR_DETAILS);
            } else if (userType === 'employ') {
                response = await axios_instance.get(URLS.LOGIN_EMPLOYEE_DASHBOARD);
            }
            setEmployee(response.data);
            handleSetData(response.data);
        } catch (error) {
            console.error("Failed to fetch profile details:", error);
        }
    };

    const handleSetData = (data) => {
        setFirstName(data.firstname);
        setLastName(data.lastname);
        setPhoneNumber(data.contact);
        setDepartment(data.department);
        setDob(data.dob);
        setDesignation(designation);
        setGender(data.gender);
        setEmail(data.email)
        setAddress(data.address);
        setProfileImg(data.profilePic);
        setDateOfHired(data.dateOfHired);
        setDateOfJoined(data.dateOfJoined);
    }

    const handleCancel = () => {
        handleSetData(employee);
        setIsEditing(false)
    }

    useEffect(() => {
        get_profile();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("")
        const formData = new FormData();
        formData.append("firstname", firstName);
        formData.append("lastname", lastName);
        formData.append("email", email);
        formData.append("contact", phoneNumber);
        formData.append("gender", gender);
        formData.append("dob", dob);
        formData.append("address", address);
        formData.append("department", department);
        formData.append("designation", designation);
        formData.append("dateOfHired", employee?.dateOfHired);
        formData.append("dateOfJoined", employee?.dateOfJoined);
        formData.append("dateOfHired", dateOfHired);
        formData.append("dateOfJoined", dateOfJoined);
        formData.append("user", employee?.firstname ? employee?.user?.id : employee?.id);

        if (profileImg && profileImg !== employee.profilePic) {
            formData.append("profilePic", profileImg);
        }

        let URI;
        if (userType === 'hr') {
            URI = employee?.firstname
                ? axios_instance.put(`${URLS.HR_DETAILS_ADD}${employee.id}/`, formData)
                : axios_instance.post(URLS.HR_DETAILS_ADD, formData);
        }

        if (userType === 'employ') {
            URI = employee?.firstname
                ? axios_instance.put(`${URLS.EMPLOYEE_DETAILS_ADD}${employee.id}/`, formData)
                : axios_instance.post(URLS.EMPLOYEE_DETAILS_ADD, formData);
        }

        URI.then((response) => {
            setEmployee(response.data);
            handleSetData(response.data);
            get_profile()
            setIsEditing(false);
            notifySuccess("Profile Updated Successfully!!");
        }).catch((err) => {
            console.warn(err);
            setError(err.response.data.user[0] || "Error setting up the request")
        });
    }

    return (
        <div className="rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 py-4 border-b pl-8 pr-8 bg-blue-400">
                <h3 className="text-xl text-white font-bold ">Personal Information</h3>
                {!isEditing && <button
                    onClick={handleEditClick}
                    className=" flex gap-2 rounded-3xl bg-white py-2 px-4 border border-transparent text-center text-sm text-blue-600 transition-all shadow-sm hover:shadow-lg focus:bg-blue-400 focus:shadow-none active:bg-blue-400 hover:bg-blue-500 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                    type="button"
                >
                    <FaEdit />
                    <span>Personal Information</span>
                </button>}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Profile Section */}
                <div className="flex items-start space-x-6">
                    <label htmlFor="fileToUpload" className="relative cursor-pointer">
                        <div
                            className="w-32 h-32 bg-cover bg-center bg-no-repeat rounded-full shadow-md transition-transform duration-300 hover:scale-105"
                            style={{backgroundImage: `url(${profileImgPreview || profileImg || '/placeholder.png'})`}}
                        >
                            {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                    <span className="text-white text-sm font-medium">Change Image</span>
                                </div>
                            )}
                        </div>
                        {isEditing && 
                            <input
                                type="file"
                                id="fileToUpload"
                                className="hidden"
                                onChange={handleFileChange}
                            />}
                    </label>

                    {/* Basic Info */}
                    {!isEditing && <div className="flex flex-col space-y-4">
                        <h4 className={sectionTitle}>
                            <span>{`${firstName || ''} ${lastName || ''}`}</span>
                        </h4>
                        <p className={contactItem}>
                            <FaEnvelope className={iconStyle} />
                            <span className={valueStyle}>{email}</span>
                        </p>
                        <p className={contactItem}>
                            <FaPhone className={iconStyle} />
                            <span className={valueStyle}>{phoneNumber}</span>
                        </p>
                        <p className={contactItem}>
                            <FaBuilding className={iconStyle} />
                            <label className={labelStyle}>Department:</label>
                            <span className={valueStyle}>{department}</span>
                        </p>
                        <p className={contactItem}>
                            <FaUserTie className={iconStyle} />
                            <label className={labelStyle}>Designation:</label>
                            <span className={valueStyle}>{designation}</span>
                        </p>
                        <p className={contactItem}>
                            <FaIdBadge className={iconStyle} />
                            <label className={labelStyle}>Employee ID:</label>
                            <span className={valueStyle}>{employee?.id}</span>
                        </p>
                        <p className={contactItem}>
                            <MdDateRange className={iconStyle} />
                            <label className={labelStyle}>Date of joined:</label>
                            <span className={valueStyle}>{dateOfJoined}</span>
                        </p>
                    </div>}
                </div>

                {/* Additional Info */}
                {!isEditing && (
                    <div className="space-y-4">
                        <div className={contactItem}>
                            <IoMaleFemaleOutline className={iconStyle} />
                            <label className={labelStyle}>Gender:</label>
                            <p className={valueStyle}>{gender}</p>
                        </div>
                        <div className={contactItem}>
                            <LiaBirthdayCakeSolid className={iconStyle} />
                            <label className={labelStyle}>Date of Birth:</label>
                            <p className={valueStyle}>{dob}</p>
                        </div>
                        <div className={contactItem}>
                            <MdDateRange className={iconStyle} />
                            <label className={labelStyle}>Date of Hired:</label>
                            <p className={valueStyle}>{dateOfHired}</p>
                        </div>
                        <div className={`${contactItem}`}>
                            <MdLocationOn className={iconStyle} />
                            <div>
                                <label className={labelStyle}>Address:</label>
                                <p className={`${valueStyle} whitespace-pre-line`}>{address}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {isEditing && <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {[
                        { label: "First Name", value: firstName, setValue: setFirstName, type: "text", placeholder: "Enter first name" },
                        { label: "Last Name", value: lastName, setValue: setLastName, type: "text", placeholder: "Enter last name" },
                        { label: "Email", value: email, setValue: setEmail, type: "email", placeholder: "Enter your email", disabled: true },
                        { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, type: "number", placeholder: "Enter phone number" },
                        { label: "Department", value: department, setValue: setDepartment, type: "text", placeholder: "Enter department", extraClass: "uppercase" },
                        { label: "Designation", value: designation, setValue: setDesignation, type: "text", placeholder: "Enter designation" },
                    ].map(({ label, value, setValue, type, placeholder, disabled, extraClass }, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label className="text-sm text-gray-500">{label}</label>
                            <input
                                type={type}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={placeholder}
                                disabled={disabled}
                                required
                                className={`customTextInput ${extraClass || ""}`}
                            />
                        </div>
                    ))}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="selectInput"
                        >
                            <option value="">Choose a gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Date of Birth</label>
                        <DatePicker
                            selected={dob ? new Date(dob) : null}
                            onChange={(date) => setDob(date ? date.toISOString().split("T")[0] : "")}
                            dateFormat="yyyy-MM-dd"
                            className="customTextInput"
                            placeholderText="YYYY-MM-DD"
                        />
                    </div>


  <div className="flex flex-col w-full">
    <label className="text-sm text-gray-500">Date of Hired</label>
    <DatePicker
      selected={dateOfHired ? new Date(dateOfHired) : null}
      onChange={(date) =>
        setDateOfHired(date ? date.toISOString().split("T")[0] : "")
      }
      dateFormat="yyyy-MM-dd"
      className="customTextInput w-full"
      placeholderText="YYYY-MM-DD"
    />
  </div>
  <div className="flex flex-col w-full">
    <label className="text-sm text-gray-500">Date of Joined</label>
    <DatePicker
      selected={dateOfJoined ? new Date(dateOfJoined) : null}
      onChange={(date) =>
        setDateOfJoined(date ? date.toISOString().split("T")[0] : "")
      }
      dateFormat="yyyy-MM-dd"
      className="customTextInput w-full"
      placeholderText="YYYY-MM-DD"
    />
  </div>



                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm text-gray-500">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                            required
                            className="customTextAreaInput"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
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
                        Save
                    </button>
                </div>
            </form>
            }

            <ErrorMessage message={error} onClose={() => setError("")} />
        </div>
    );
};

export default PersonalInformation;
