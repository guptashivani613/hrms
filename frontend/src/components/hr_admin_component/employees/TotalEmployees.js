import React from "react";
import { FaUsers, FaRegBuilding, FaUserTie } from "react-icons/fa";

function TotalEmployees({ title, count }) {
  // Define dynamic gradient background color based on the title
  const getGradientBackground = (title) => {
    switch (title) {
      case "Employee":
        return "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300";
      case "HR":
        return "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300";
      case "Manager":
        return "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300";
      default:
        return "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300";
    }
  };

  // Render static text based on the title
  const getDescriptionText = (title) => {
    switch (title) {
      case "Employee":
        return "Our workforce of dedicated employees drives the company forward.";
      case "HR":
        return "The HR team ensures a smooth employee experience and relations.";
      case "Manager":
        return "Managers provide guidance and oversee key operations.";
      default:
        return "Information about the company's personnel.";
    }
  };

  // Render icons dynamically
  const getIcon = (title) => {
    switch (title) {
      case "Employee":
        return <FaUsers className="text-5xl text-white drop-shadow-lg" />;
      case "HR":
        return <FaRegBuilding className="text-5xl text-white drop-shadow-lg" />;
      case "Manager":
        return <FaUserTie className="text-5xl text-white drop-shadow-lg" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg py-6 px-6 w-full my-4 max-w-lg mx-auto text-white ${getGradientBackground(
        title
      )}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-2xl font-bold">{title}</h5>
          <p className="text-sm mt-1">{getDescriptionText(title)}</p>
        </div>
        <div className="">{getIcon(title)}</div>
      </div>
      <div className="mt-6">
        <div className="text-center">
          <h5 className="text-5xl font-extrabold">{count}</h5>
          <p className="text-lg mt-1 font-medium">Total {title}</p>
        </div>
      </div>
    </div>
  );
}

export default TotalEmployees;
