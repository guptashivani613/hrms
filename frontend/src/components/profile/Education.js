import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios_instance from "../../libs/interseptor";
import apiUrls from "../../libs/apiUrls";

const Education = () => {
  const [isEditingId, setIsEditingId] = useState(null);
  const [educationList, setEducationList] = useState([]);

  const fetchEducationData = async () => {
    try {
      const response = await axios_instance.get(`${apiUrls.EDUCATION}`);
      setEducationList(response.data);
    } catch (error) {
      console.error("Error fetching education data", error);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now(),
      title: "",
      degree: "",
      startDate: null,
      endDate: null,
    };
    setEducationList((prevList) => [...prevList, newEducation]);
    setIsEditingId(newEducation.id);
  };

  const handleInputChange = (id, field, value) => {
    setEducationList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDeleteEducation = async (id) => {
    try {
      await axios_instance.delete(`${apiUrls.EDUCATION}${id}/`);
      setEducationList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting education entry", error);
    }
  };

  const handleCancelEdit = () => {
    setEducationList((prevList) =>
        prevList.filter((item) => item.id !== isEditingId)
      );
      setIsEditingId(null);
  };

  const handleSaveChanges = async (data) => {
    setIsEditingId(null);

    const updatedEducation = educationList.find((item) => item.id === data.id);

    const payload = {
      ...updatedEducation,
      start_date: updatedEducation.startDate
        ? updatedEducation.startDate.toISOString().split("T")[0]
        : null,
      end_date: updatedEducation.endDate
        ? updatedEducation.endDate.toISOString().split("T")[0]
        : null,
    };

    try {
      await axios_instance.post(`${apiUrls.EDUCATION}`, payload);
      fetchEducationData();
    } catch (error) {
      console.error("Error saving changes", error);
    }
  };


  const containerStyle = "bg-white shadow-sm rounded-md";
  const headerStyle = "flex justify-between items-center mb-4 py-4 border-b p-6 bg-blue-400";
  const titleStyle = "text-xl text-white font-semibold";
  const buttonStyle =
    "flex gap-2 rounded-3xl bg-white py-2 px-4 border border-transparent text-center text-sm text-blue-600 transition-all shadow-sm hover:shadow-lg focus:shadow-none active:bg-blue-400 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2";
  const sectionStyle = "space-y-6 p-6";
  const itemContainerStyle = "border-l-4 border-blue-600 pl-4 py-4";
  const itemTitleStyle = "text-lg font-semibold text-gray-700";
  const itemSubtitleStyle = "text-sm text-gray-600";
  const itemDateStyle = "text-sm text-gray-500";
  const iconStyle = "cursor-pointer text-gray-500 hover:text-red-600 ml-4";

  return (
    <div className={containerStyle}>
      {/* Header */}
      <div className={headerStyle}>
        <h3 className={titleStyle}>Education Qualification</h3>
        <button className={buttonStyle} type="button" onClick={handleAddEducation}>
          <FaPlus /> <span>Add Education</span>
        </button>
      </div>

      {/* Education List */}
      <div className={sectionStyle}>
        {educationList.map((item) => (
          <div
            key={item.id}
            className={`${itemContainerStyle}`}
          >
            {isEditingId === item.id ? (
              <div className="space-y-3">
                <div>
                  <p>School / College</p>
                  <input
                    className="customTextInput my-1"
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleInputChange(item.id, "title", e.target.value)
                    }
                    placeholder="School / College"
                  />
                </div>
                <div>
                  <p>Degree / Course</p>
                  <input
                    className="customTextInput my-1"
                    type="text"
                    value={item.degree}
                    onChange={(e) =>
                      handleInputChange(item.id, "degree", e.target.value)
                    }
                    placeholder="Degree / Diploma"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p>Start Date</p>
                    <DatePicker
                      selected={item.startDate}
                      onChange={(date) =>
                        handleInputChange(item.id, "startDate", date)
                      }
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      className="customTextInput my-1"
                    />
                  </div>
                  <div>
                    <p>End Date</p>
                    <DatePicker
                      selected={item.endDate}
                      onChange={(date) =>
                        handleInputChange(item.id, "endDate", date)
                      }
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="Present"
                      className="customTextInput my-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={handleCancelEdit}
                    type="button"
                    className="formCancelBtn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { handleSaveChanges(item) }}
                    type="button"
                    className="formSubmitBtn"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={itemTitleStyle}>{item.title || "No Title"}</h3>
                <p className={itemSubtitleStyle}>{item.degree || "No Degree"}</p>
                <p className={itemDateStyle}>
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

                <div className="flex justify-end">
                  {/* <FaEdit
                    className={iconStyle}
                    onClick={() => setIsEditingId(item.id)}
                  /> */}
                  <FaTrashAlt
                    className={iconStyle}
                    onClick={() => handleDeleteEducation(item.id)}
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

export default Education;
