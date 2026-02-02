import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin2Line } from "react-icons/ri";
import apiUrls from "../../../libs/apiUrls";
import axios_instance from "../../../libs/interseptor";
import Cookies from 'js-cookie';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [addNew, setAddNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    date: "",
    description: "",
  });
  const userType = Cookies.get('userType');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHoliday({ ...newHoliday, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", newHoliday.name);
    formData.append("date", newHoliday.date);
    formData.append("description", newHoliday.description);

    try {
      let response;
      if (newHoliday.id) {
        response = await axios_instance.put(`${apiUrls.HOLIDAY_LIST}${newHoliday.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setHolidays(holidays.map((holiday) =>
          holiday.id === newHoliday.id ? response.data : holiday
        ));
        handleClearInput()
      } else {
        response = await axios_instance.post(apiUrls.HOLIDAY_LIST, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setHolidays([response.data, ...holidays]);
        handleClearInput()
      }

      setNewHoliday({ name: "", date: "", description: "", id: null });
      setAddNew(false);

    } catch (error) {
      console.error("Failed to save holiday:", error);
    } finally {
      setIsLoading(false);
    }
  };

const handleClearInput = ()=>{
  setNewHoliday({
    name: "",
    date: "",
    description: ""
  })
}
  const handleEdit = (holidayId) => {
    const holidayToEdit = holidays.find(holiday => holiday.id === holidayId);
    setNewHoliday({
      ...holidayToEdit,
      date: new Date(holidayToEdit.date).toISOString().split("T")[0],
    });
    setAddNew(true);
  };

  const handleDelete = (holidayId) => {
    setHolidayToDelete(holidayId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (holidayToDelete) {
      try {
        await axios_instance.delete(`${apiUrls.HOLIDAY_LIST}${holidayToDelete}/`);
        setHolidays(holidays.filter((holiday) => holiday.id !== holidayToDelete));
      } catch (error) {
        console.error("Failed to delete holiday:", error);
      }
    }
    setIsModalOpen(false);
    setHolidayToDelete(null);
  };

  const handleCancel = ()=>{
    setAddNew(!addNew)
    handleClearInput()
  }

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setHolidayToDelete(null);
  };


  useEffect(() => {
    const getHoliday = async () => {
      try {
        const response = await axios_instance.get(apiUrls.HOLIDAY_LIST);
        setHolidays(response.data);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };
    getHoliday();
  }, []);

  return (
    <div className="min-h-screen container mx-auto py-8 px-4 text-gray-500">
      <h3 className="flex justify-center gap-2 text-3xl font-extrabold text-center text-gray-500 mb-10">
        <img
          className="w-40"
          src="https://media.licdn.com/dms/image/v2/D4D0BAQE0B5f5KUjoDg/company-logo_200_200/company-logo_200_200/0/1694285115143/dataclaps_logo?e=1756944000&v=beta&t=3EfvgOjNGpeu8oSAeNcyMFwPCWpmVruDf_V7J5YowuE"
          alt="Holiday Logo"
        />
        &nbsp;Holidays
      </h3>

      <div className="flex justify-end py-2 mb-2">
        {userType === 'hr' && !addNew && (
          <button
            className="formCancelBtn"
            onClick={() => { setAddNew(!addNew); }}
          >
            Add New Holiday
          </button>
        )}
      </div>

      {addNew ? (
        <div className="">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-lg font-semibold text-gray-700 mb-2">Holiday Name</label>
                <input
                  type="text"
                  name="name"
                  value={newHoliday.name}
                  onChange={handleInputChange}
                  placeholder="Enter holiday name"
                  className="customTextInput"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="date" className="text-lg font-semibold text-gray-700 mb-2">Holiday Date</label>
                <DatePicker
                  selected={newHoliday.date ? new Date(newHoliday.date) : null}
                  onChange={(date) =>
                    setNewHoliday((prev) => ({
                      ...prev,
                      date: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="customTextInput"
                  placeholderText="YYYY-MM-DD"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-lg font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={newHoliday.description}
                onChange={handleInputChange}
                placeholder="Write a brief description"
                className="customTextAreaInput"
                required
              />
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
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Holiday"}
              </button>
            </div>
          </form>
        </div>
      )
        :
        <table className="min-w-full table-auto border border-gray-200 shadow-md rounded-lg">
  <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
    <tr>
      <th className="py-4 px-4">SL. No.</th>
      <th className="py-4 px-4">Date</th>
      <th className="py-4 px-4">Holiday Name</th>
      <th className="py-4 px-4">Description</th>
      {userType === 'hr' && (
        <th className="py-4 px-4 text-center">Actions</th>
      )}
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {holidays.length > 0 ? (
      holidays.map((holiday, i) => (
        <tr key={holiday.id} className="hover:bg-blue-50 transition-colors duration-200">
          <td className="py-4 px-4">{i + 1}</td>
          <td className="py-4 px-4">{new Date(holiday.date).toLocaleDateString()}</td>
          <td className="py-4 px-4">{holiday.name}</td>
          <td className="py-4 px-4">{holiday.description}</td>
          {userType === 'hr' && (
            <td className="py-4 px-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => handleEdit(holiday.id)}
                className="text-yellow-500 hover:text-yellow-600 transition"
              >
                <TbEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(holiday.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <RiDeleteBin2Line size={20} />
              </button>
            </td>
          )}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={userType === 'hr' ? 5 : 4} className="text-center py-4 text-gray-500">
          No holidays available
        </td>
      </tr>
    )}
  </tbody>
</table>



      }

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this holiday?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default HolidayList;
