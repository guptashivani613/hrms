import React, { useEffect, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import ConfirmationModal from "../../Modal/ConfirmationModal";
import UpdateEmployee from "./UpdateEmployee";

function EmployeesTableRow({
  id,
  emp_id,
  employee_name,
  first_name,
  last_name,
  email,
  type,
  employees,
  setEmployees,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateEmpModal, setUpdateEmpModal] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting employee ${employee_name} with ID ${emp_id}`);
    setEmployees((prev) => prev.filter((employee) => employee.id !== emp_id));
    setIsModalOpen(false);
  };

  const handleUpdateEmpModal = () => {
    setUpdateEmpModal(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6">{id}</td>
        <td className="py-3 px-6">{emp_id}</td>
        <td className="py-3 px-6">{first_name}</td>
        <td className="py-3 px-6">{last_name}</td>
        <td className="py-3 px-6">{email}</td>
        <td className="py-3 px-6">{
          type=="EMPLOYEE" ? 
          <button className="bg-green-500 p-2 rounded-lg text-white flex items-center gap-1"><AiOutlineDownload/>Download</button>
          :
          <button className="bg-red-500 p-2 rounded-lg text-white flex items-center gap-1 opacity-50 cursor-not-allowed"><MdDoNotDisturbAlt/>Restricted</button>
        }</td>
        <td className="py-3 px-6">{type}</td>
        {type=="EMPLOYEE" ? 
        <td className="py-3 px-6 flex justify-center gap-4 text-xl">
          <GrEdit
            onClick={() => setUpdateEmpModal(true)}
            className="cursor-pointer hover:text-green-500"
          />
          <AiTwotoneDelete
            onClick={handleDeleteClick}
            className="cursor-pointer hover:text-red-500"
          />
        </td>
        :
        <td colSpan="7" className="text-center py-4 text-red-600">
        Action Restricted
        </td>
        }
      </tr>

      <UpdateEmployee
        isOpen={updateEmpModal}
        onClose={handleUpdateEmpModal}
        emp_type={type}
        emp_id={emp_id}
        emp_email={email}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={`Delete Employee: ${employee_name}`}
        message={`Are you sure you want to delete the record of ${employee_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export default EmployeesTableRow;

