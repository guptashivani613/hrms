import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios_instance from "../../libs/interseptor";
import apiUrls from "../../libs/apiUrls";

const Experience = () => {
  const [isEditingId, setIsEditingId] = useState(null);
  const [experienceList, setExperienceList] = useState([]);

  const fetchEducationData = async () => {
    try {
      const response = await axios_instance.get(`${apiUrls.EXPERIENCE}`);
      setExperienceList(response.data);
    } catch (error) {
      console.error("Error fetching EXPERIENCE data", error);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  // Add a new experience entry
  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(), // Unique ID
      company_name: "",
      role: "",
      start_date: null,
      end_date: null,
    };
    setExperienceList((prevList) => [...prevList, newExperience]);
    setIsEditingId(newExperience.id);
  };

  // Edit experience fields
  const handleInputChange = (id, field, value) => {
    setExperienceList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Delete an experience entry
  const handleDeleteExperience = async (id) => {
    try {
      await axios_instance.delete(`${apiUrls.EXPERIENCE}${id}/`);
      setExperienceList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting EXPERIENCE entry", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setExperienceList((prevList) =>
      prevList.filter((item) => item.id !== isEditingId)
    );

    setIsEditingId(null);
  };

  // Save changes
  const handleSaveChanges = async (data) => {
    setIsEditingId(null);

    const updateExperienceList = experienceList.find((item) => item.id === data.id);

    const payload = {
      ...updateExperienceList,
      start_date: updateExperienceList.start_date
        ? updateExperienceList.start_date.toISOString().split("T")[0]
        : null,
      end_date: updateExperienceList.end_date
        ? updateExperienceList.end_date.toISOString().split("T")[0]
        : null,
    };

    try {
      await axios_instance.post(`${apiUrls.EXPERIENCE}`, [payload]); // Wrap payload in an array
      fetchEducationData();
    } catch (error) {
      console.error("Error saving changes", error);
    }
  };


  // Internal CSS class constants
  const containerStyle = "bg-white shadow-sm rounded-md";
  const headerStyle = "flex justify-between items-center mb-4 py-4 border-b p-6 bg-blue-400";
  const titleStyle = "text-xl text-white font-semibold";
  const buttonStyle =
    "flex gap-2 rounded-3xl bg-white py-2 px-4 border border-transparent text-center text-sm text-blue-600 transition-all shadow-sm hover:shadow-lg focus:shadow-none active:bg-blue-400 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2";
  const sectionStyle = "space-y-6 p-6";
  const itemContainerStyle = "";
  const itemTitleStyle = "text-lg font-semibold text-gray-700";
  const itemSubtitleStyle = "text-sm text-gray-600";
  const itemDateStyle = "text-sm text-gray-500";
  const iconStyle = "cursor-pointer text-gray-500 hover:text-red-600 ml-4";

  return (
    <div className={containerStyle}>
      {/* Header */}
      <div className={headerStyle}>
        <h3 className={titleStyle}>Work Experience</h3>
        <button className={buttonStyle} type="button" onClick={handleAddExperience}>
          <FaPlus /> <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      <div className={sectionStyle}>
        {experienceList.map((item) => (
          <div key={item.id} className={`${itemContainerStyle}`}>
            {isEditingId === item.id ? (
              <div className="space-y-3">
                <div>
                  <p>Company</p>
                  <input
                    className="customTextInput my-1"
                    type="text"
                    value={item.company_name}
                    onChange={(e) => handleInputChange(item.id, "company_name", e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <p>Role</p>
                  <input
                    className="customTextInput my-1"
                    type="text"
                    value={item.role}
                    onChange={(e) => handleInputChange(item.id, "role", e.target.value)}
                    placeholder="Job Title / Role"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p>Start Date</p>
                    <DatePicker
                      selected={item.start_date}
                      onChange={(date) => handleInputChange(item.id, "start_date", date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      className="customTextInput my-1"
                    />
                  </div>
                  <div>
                    <p>End Date</p>
                    <DatePicker
                      selected={item.end_date}
                      onChange={(date) => handleInputChange(item.id, "end_date", date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="Present"
                      className="customTextInput my-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={handleCancelEdit} type="button" className="formCancelBtn">
                    Cancel
                  </button>
                  <button onClick={() => { handleSaveChanges(item) }} type="button" className="formSubmitBtn">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex border-l-4 border-green-500 items-start space-x-4 p-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-sky-500 text-white text-lg font-semibold rounded-full">
                  {item.company_name ? item.company_name.charAt(0).toUpperCase() : "N"}
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">{item.company_name || "No Company"}</h3>
                  <p className="text-md text-gray-600">{item.role || "No Role"}</p>
                  <p className="text-sm text-gray-500">
                    {item.start_date
                      ? new Date(item.start_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                      : "Start Date"}{" "}
                    -{" "}
                    {item.end_date
                      ? new Date(item.end_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                      : "End Date"}
                  </p>
                </div>

                {/* Delete Button */}
                <div className="flex items-center justify-center">
                  <FaTrashAlt
                    className={iconStyle}
                    onClick={() => handleDeleteExperience(item.id)}
                  />
                </div>
              </div>

            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
