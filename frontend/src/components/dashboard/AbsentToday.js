import React from 'react';

const AbsentToday = ({userAttendance}) => {
  const d = new Date(); 

  const today = d.toISOString().split("T")[0]; 
  
  const presentEmp =userAttendance && userAttendance?.filter(item => {
      if (item.date === today) {
          return item
      }
  });

  return (
<div className="w-full">
<h2 className="text-2xl font-semibold text-gray-800 mb-4">
    Present Today
  </h2>

  <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
    <table className="min-w-full bg-white divide-y divide-gray-200">
      <thead className="bg-gradient-to-r from-green-500 to-pink-500 text-white">
        <tr>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide">
            S. No.
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide">
            Employee
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide">
            Status
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide">
            Login
          </th>
          <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide">
            Logout
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {presentEmp && presentEmp.map((employee, index) => (
          <tr
            key={index}
            className="hover:bg-red-50 transition duration-200 ease-in-out"
          >
            <td className="py-4 px-6 text-sm font-medium text-gray-800">
              {index+1}
            </td>
            <td className="py-4 px-6 text-sm font-medium text-gray-800">
              {employee?.user?.first_name} {employee?.user?.last_name}
            </td>
            <td className="py-4 px-6 text-sm font-bold text-green-500">
              Present
            </td>
            <td className="py-4 px-6 text-sm font-bold ">
              {employee?.login_time_formatted}
            </td>
            <td className="py-4 px-6 text-sm font-bold ">
              {employee?.logout_time_formatted ? employee?.logout_time_formatted : "working"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AbsentToday;
