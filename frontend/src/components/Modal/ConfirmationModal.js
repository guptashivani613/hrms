import React from "react";
import apiUrls from "../../libs/apiUrls";
import axios_instance from "../../libs/interseptor";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText ,emp_id, employees, setEmployees}) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await axios_instance.delete(`${apiUrls.USER_FIND}${emp_id}/`);

      if (response.status == 204) {
        setEmployees(employees.filter((detail) => detail.id !== emp_id));
      } else {
        alert("Failed to delete the user. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      onConfirm()
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
