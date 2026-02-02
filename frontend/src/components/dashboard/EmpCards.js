import React from 'react';
import { MdAssignment, MdCheckCircle, MdWork, MdAccessTime } from 'react-icons/md';

const EmpCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* New Tickets Card */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-indigo-600 p-3 rounded-full shadow-md">
            <MdAssignment className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">New Tickets</h2>
            <p className="text-lg">{`313`}</p>
            <p className="text-sm text-green-300">+10% Than Last Year</p>
          </div>
        </div>
      </div>

      {/* Tickets Resolved Card */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-green-600 p-3 rounded-full shadow-md">
            <MdCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Tickets Resolved</h2>
            <p className="text-lg">{`55`}</p>
            <p className="text-sm text-green-300">+2.15% Than Last Month</p>
          </div>
        </div>
      </div>

      {/* Projects Assigned Card */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-blue-600 p-3 rounded-full shadow-md">
            <MdWork className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Projects Assigned</h2>
            <p className="text-lg">{`313`}</p>
            <p className="text-sm text-green-300">+5.15% Than Last Month</p>
          </div>
        </div>
      </div>

      {/* Available Leaves Card */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-yellow-600 p-3 rounded-full shadow-md">
            <MdAccessTime className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Available Leaves</h2>
            <p className="text-lg">{`150`}</p>
            <p className="text-sm text-green-300">+5.5% Than Last Month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpCards;
