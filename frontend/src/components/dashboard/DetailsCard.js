import React from "react";
import { FaUsers, FaProjectDiagram, FaDollarSign, FaTasks } from "react-icons/fa";
import { MdOutlineBusiness, MdOutlineWork } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi";

const DetailsCard = ({employeeDetail, userAttendance}) => {
  const d = new Date(); 

  const today = d.toISOString().split("T")[0]; 
  
  const presentEmp =userAttendance && userAttendance?.filter(item => {
      if (item.date === today) {
          return item
      }
  });

  // Dummy Data
  const dashboardData = [
    {
      title: "Total Employee",
      count: employeeDetail && employeeDetail?.length,
      growth: "+10%",
      description: "Than Last Year",
      bgGradient: "bg-gradient-to-r from-blue-400 to-blue-600",
      textColor: "text-blue-900",
      icon: <FaUsers />,
    },
    {
      title: "Present Employee",
      count: presentEmp && presentEmp?.length,
      growth: "+2.15%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-red-400 to-red-600",
      textColor: "text-red-900",
      icon: <FaUsers />,
    },
    {
      title: "Total Project",
      count: 313,
      growth: "+5.15%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-green-400 to-green-600",
      textColor: "text-green-900",
      icon: <FaProjectDiagram />,
    },
    {
      title: "Completed Project",
      count: 150,
      growth: "+5.5%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      textColor: "text-yellow-900",
      icon: <FaTasks />,
    },
    {
      title: "Total Client",
      count: 151,
      growth: "+2.15%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-purple-400 to-purple-600",
      textColor: "text-purple-900",
      icon: <MdOutlineBusiness />,
    },
    {
      title: "Total Revenue",
      count: "$55",
      growth: "+2.15%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-indigo-400 to-indigo-600",
      textColor: "text-indigo-900",
      icon: <FaDollarSign />,
    },
    {
      title: "Total Jobs",
      count: 55,
      growth: "+2.15%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-pink-400 to-pink-600",
      textColor: "text-pink-900",
      icon: <MdOutlineWork />,
    },
    {
      title: "Total Tickets",
      count: 55,
      growth: "+2.15%",
      description: "Than Last Month",
      bgGradient: "bg-gradient-to-r from-teal-400 to-teal-600",
      textColor: "text-teal-900",
      icon: <HiOutlineTicket />,
    },
  ];

  // Function to generate random position
  const getRandomPosition = () => ({
    top: `${Math.floor(Math.random() * 70) - 20}%`,
    left: `${Math.floor(Math.random() * 100) - 20}%`,
  });

  // Card Component
  const Card = ({ title, count, growth, description, bgGradient, textColor, icon }) => {
    const randomPosition = getRandomPosition();

    return (
      <div
        className={`${bgGradient} relative flex flex-col justify-between p-6 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all w-full h-52 overflow-hidden`}
      >
        {/* Circle Background */}
        <div
          className="absolute w-32 h-32 rounded-full border-[4rem] bg-yellow-50 border-white opacity-30"
          style={{
            ...randomPosition,
            transform: "translate(-50%, -50%)",
          }}
        ></div>

        <div className="flex items-center space-x-4 z-10">
          <div
            className={`w-14 h-14 bg-white bg-opacity-30 rounded-full flex items-center justify-center shadow-lg`}
          >
            <span className={`${textColor} text-3xl`}>{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-3xl font-bold text-white">{count}</p>
          </div>
        </div>
        <div className="z-10">
          <p className={`text-sm font-semibold text-white`}>{growth}</p>
          <p className="text-white text-xs">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dashboardData.map((data, index) => (
        <Card key={index} {...data} />
      ))}
    </div>
  );
};

export default DetailsCard;
