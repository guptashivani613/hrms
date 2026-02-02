import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { FaEdit } from "react-icons/fa";
import axios_instance from "../../libs/interseptor";
import * as URLS from "../../libs/apiUrls";

const Accordion = () => {
  const [accData, setAccData] = useState([]);
  const [isAddNotif, setisAddNotif] = useState(false);
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [itemNotif, setItemNotif] = useState(null);
  const [isEditNotif, setIsEditNotif] = useState(false);
  const userType = Cookies.get("userType");

  const handleGetData = () => {
    axios_instance
      .get(URLS.ANNOUNCEMENTS)
      .then((res) => setAccData(res.data))
      .catch((err) => console.log(err));
  };

  const handleAddNotif = () => {
    setisAddNotif(true);
  };

  const handleEditNotif = (item) => {
    setIsEditNotif(true);
    setisAddNotif(true);
    setItemNotif(item);
    setHeader(item.header);
    setDescription(item.description);
    setDate(item.date);
  };

  const handleDelete = () => {
    axios_instance
      .delete(`${URLS.ANNOUNCEMENTS}${itemNotif.id}/`)
      .then(() => {
        handleGetData();
        setisAddNotif(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const payload = { header, description, date: formattedDate };

    const request = isEditNotif
      ? axios_instance.put(`${URLS.ANNOUNCEMENTS}${itemNotif.id}/`, payload)
      : axios_instance.post(URLS.ANNOUNCEMENTS, payload);

    request
      .then(() => {
        handleGetData();
        setisAddNotif(false);
        if (isEditNotif) setIsEditNotif(false);
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    setisAddNotif(false);
    if (isEditNotif) setIsEditNotif(false);
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="w-full space-y-2">
      {/* Header */}
      {userType === "hr" && (
        <div className="flex justify-end">
          <button
            onClick={handleAddNotif}
            className=" flex items-center gap-2 rounded-3xl bg-blue-400 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-blue-400 focus:shadow-none active:bg-blue-400 hover:bg-blue-500 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
          >
            <IoMdAddCircleOutline />
            <span>Announcement</span>
          </button>
        </div>
      )}

      {/* Announcements */}
      {!isAddNotif ? (
        <div className="space-y-4">
      {accData.length > 0 ? (
        accData.map((val) => (
          <div
            key={val.id}
            className="bg-gradient-to-r from-indigo-200 to-indigo-500 text-white shadow-sm rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out"
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-800">{val.header}</h3>
                {userType === 'hr' && (
                  <button
                    onClick={() => handleEditNotif(val)}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 py-2 px-4 text-white transition-all hover:opacity-80 active:opacity-60 focus:outline-none"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">📅 {val.date}</p>
              <p className="text-gray-800 text-sm mt-2">{val.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-lg bg-gradient-to-r from-indigo-200 to-indigo-500 text-white py-4 px-6 rounded-lg shadow-xl font-semibold">
  No Announcements Available
</p>

      )}
    </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg space-y-6 p-6"
        >
          <h2 className="text-3xl font-semibold text-gray-800">
            {isEditNotif ? "Edit Announcement" : "Add New Announcement"}
          </h2>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="customTextInput"
                placeholder="Enter title"
                required
              />
            </div>
            {/* Date */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Date</label>
              <DatePicker
                selected={date ? new Date(date) : null}
                onChange={(date) => setDate(date ? date.toISOString().split("T")[0] : "")}
                dateFormat="yyyy-MM-dd"
                className="customTextInput"
                placeholderText="Select date"
                required
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="customTextAreaInput"
                placeholder="Enter description"
                rows="6"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-6 mt-8">
            {/* Delete Button */}
            {isEditNotif && (
              <button
                type="button"
                onClick={handleDelete}
                className="formDeleteBtn"
              >
                Delete
              </button>
            )}
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="formCancelBtn"
            >
              Cancel
            </button>
            {/* Save Button */}
            <button
              type="submit"
              className="formSubmitBtn"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>

  );
};

export default Accordion;
