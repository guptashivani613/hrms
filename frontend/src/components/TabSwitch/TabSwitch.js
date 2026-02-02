import React, { useState } from "react";

const TabSwitch = ({ tabs, components }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  return (
    <div className="p-4">
  <div className="flex space-x-4 border-b mb-6">
    {tabs.map((tabName, index) => (
      <button
        key={index}
        onClick={() => handleTabClick(index)}
        className={`relative px-6 py-3 font-semibold text-sm transition-colors duration-300 ${
          currentTab === index
            ? "text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-blue-500"
            : "text-gray-500 hover:text-blue-500"
        }`}
      >
        {tabName}
      </button>
    ))}
  </div>
  <div className="p-2">
    {components[currentTab]}
  </div>
</div>

  );
};

export default TabSwitch;
