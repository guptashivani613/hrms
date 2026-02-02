import React from 'react';

const meetings = [
  { title: 'Project Kickoff', date: 'June 1, 2024', time: '10:00 AM' },
  { title: 'Weekly Team Sync', date: 'June 5, 2024', time: '02:00 PM' },
  { title: 'Client Presentation', date: 'June 10, 2024', time: '11:00 AM' },
];

const MeetingSchedule = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meeting Schedule</h2>

      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
  <table className="min-w-full bg-white divide-y divide-gray-200">
    <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <tr>
        <th
          className="py-4 px-6 text-left text-sm font-semibold tracking-wide uppercase"
        >
          Meeting Title
        </th>
        <th
          className="py-4 px-6 text-left text-sm font-semibold tracking-wide uppercase"
        >
          Meeting Date
        </th>
        <th
          className="py-4 px-6 text-left text-sm font-semibold tracking-wide uppercase"
        >
          Meeting Time
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {meetings.map((meeting, index) => (
        <tr
          key={index}
          className="hover:bg-blue-50 transition-colors duration-200"
        >
          <td className="py-4 px-6 text-sm font-medium text-gray-800">
            {meeting.title}
          </td>
          <td className="py-4 px-6 text-sm text-gray-600">
            {meeting.date}
          </td>
          <td className="py-4 px-6 text-sm text-gray-600">
            {meeting.time}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default MeetingSchedule;
