import React from "react";
import EmployeesTableRow from "./EmployeesTableRow";

function EmployeesTable({ employees, setEmployees, isLoading, setIsLoading }) {
  return (
    <div className="w-full overflow-x-auto mt-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              <th className="py-4 px-6 text-left">S.No</th>
              <th className="py-4 px-6 text-left">E_Id</th>
              <th className="py-4 px-6 text-left">First Name</th>
              <th className="py-4 px-6 text-left">Last Name</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Salary</th>
              <th className="py-4 px-6 text-left">Type</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees && employees.length > 0 ? (
              employees.map((e, i) => (
                <EmployeesTableRow
                  key={e.id}
                  id={i + 1}
                  emp_id={e.id}
                  first_name={e.first_name}
                  last_name={e.last_name}
                  email={e.email}
                  type={e.type}
                  employees={employees}
                  setEmployees={setEmployees}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-600">
                  No Record Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeesTable;

