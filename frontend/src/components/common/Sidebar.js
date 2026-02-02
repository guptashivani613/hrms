import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { MdSpaceDashboard } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdBeachAccess } from "react-icons/md";
import { RiCalendarEventLine } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userType = Cookies.get('userType');

  useEffect(() => {
    if (localStorage.getItem("tab")) {
      setSelectedTab(localStorage.getItem("tab"));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem('tab', tab);
  };

  return (
    <div>
      <nav id="sidebar" className="lg:w-[250px] w-[80px] bg-gray-800 text-white h-screen transition-all duration-300 overflow-y-scroll overflow-x-hidden">
        <div id="sidebar-collapse-menu"
          className={`shadow-lg h-screen transition-all duration-500 ${isSidebarOpen ? "w-[250px] opacity-100" : "w-[80px] opacity-80"}`}>
          <div className="pt-8 pb-2 px-6 sticky top-0 min-h-[80px] z-[100]">
            <a href={`${userType === 'hr' ? "/hr/dashboard" : "/employ/dashboard" }`} className="outline-none">
              <img
                src={`${isSidebarOpen ? "https://media.licdn.com/dms/image/v2/D4D0BAQE0B5f5KUjoDg/company-logo_200_200/company-logo_200_200/0/1694285115143/dataclaps_logo?e=1756944000&v=beta&t=3EfvgOjNGpeu8oSAeNcyMFwPCWpmVruDf_V7J5YowuE" : "/small_logo.png"}`}
                alt="logo"
                className={`transition-all duration-300 ${isSidebarOpen ? "w-[170px]" : "w-[40px]"}`}
              />
            </a>
          </div>

          <div className="py-6 px-4">
            <ul className="space-y-2">
              <li>
                <a
                  href={`${userType === 'hr' ? "/hr/dashboard" : "/employ/dashboard" }`}
                  className={`menu-item text-sm flex items-center cursor-pointer hover:bg-[#1a1a1a] rounded-md px-4 py-3 transition-all duration-300 ${selectedTab === 'dashboard' ? 'bg-[#2a2a2a]' : ''}`}
                  onClick={() => handleSelectedTab('dashboard')}
                >
                  <MdSpaceDashboard size={20} className="mr-4" />
                  {isSidebarOpen && <span>Dashboard</span>}
                </a>
              </li>

              {userType === 'hr' && (
                <li>
                  <a
                    href={`${userType === 'hr' ? "/hr/view-employees" : "/employ/view-employees"}`}
                    className={`menu-item text-sm flex items-center cursor-pointer hover:bg-[#1a1a1a] rounded-md px-4 py-3 transition-all duration-300 ${selectedTab === 'employee' ? 'bg-[#2a2a2a]' : ''}`}
                    onClick={() => handleSelectedTab('employee')}
                  >
                    <HiOutlineUserGroup size={20} className="mr-4" />
                    {isSidebarOpen && <span>Employees</span>}
                  </a>
                </li>
              )}

              <li>
                <a
                  href={`${userType === 'hr' ? "/hr/salary" : "/employ/salary"}`}
                  className={`menu-item text-sm flex items-center cursor-pointer hover:bg-[#1a1a1a] rounded-md px-4 py-3 transition-all duration-300 ${selectedTab === 'salary' ? 'bg-[#2a2a2a]' : ''}`}
                  onClick={() => handleSelectedTab('salary')}
                >
                  <FaMoneyBillWave size={20} className="mr-4" />
                  {isSidebarOpen && <span>Salary</span>}
                </a>
              </li>

              {userType === 'hr' && (
                <li>
                  <a
                    href={`${userType === 'hr' ? "/hr/leave-policy" : "/employ/leave-policy"}`}
                    className={`menu-item text-sm flex items-center cursor-pointer hover:bg-[#1a1a1a] rounded-md px-4 py-3 transition-all duration-300 ${selectedTab === 'leave policy' ? 'bg-[#2a2a2a]' : ''}`}
                    onClick={() => handleSelectedTab('leave policy')}
                  >
                    <AiOutlineFileText size={20} className="mr-4" />
                    {isSidebarOpen && <span>Leave Policy</span>}
                  </a>
                </li>
              )}

              <li>
                <a
                  href={`${userType === 'hr' ? "/hr/holidays" : "/employ/holidays"}`}
                  className={`menu-item text-sm flex items-center cursor-pointer hover:bg-[#1a1a1a] rounded-md px-4 py-3 transition-all duration-300 ${selectedTab === 'holidays' ? 'bg-[#2a2a2a]' : ''}`}
                  onClick={() => handleSelectedTab('holidays')}
                >
                  <MdBeachAccess size={20} className="mr-4" />
                  {isSidebarOpen && <span>Holidays</span>}
                </a>
              </li>

              {userType === 'employ' && (
                <li>
                  <a
                    href="/employ/leave"
                    className={`menu-item text-sm flex items-center cursor-pointer hover:bg-[#1a1a1a] rounded-md px-4 py-3 transition-all duration-300 ${selectedTab === 'leave' ? 'bg-[#2a2a2a]' : ''}`}
                    onClick={() => handleSelectedTab('leave')}
                  >
                    <RiCalendarEventLine size={20} className="mr-4" />
                    {isSidebarOpen && <span>Leave</span>}
                  </a>
                </li>
              )}
            </ul>

            {isSidebarOpen && (
              <div className="mt-8 bg-[#00b074] p-4 rounded-md shadow-md">
                <h3 className="text-white text-lg font-semibold mb-2">Dataclaps</h3>
                <p className="mb-4 text-white text-sm leading-relaxed">
                  Organize your menus with <span className="font-bold">Dataclaps</span>!
                </p>
                <a
                  href="https://dataclaps.com/"
                  className="py-2 px-4 bg-white hover:bg-gray-100 text-gray-800 text-sm border-none outline-none rounded-md mt-4"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <button
        id="toggle-sidebar"
        onClick={toggleSidebar}
        className="lg:hidden w-8 h-8 z-[100] fixed top-[10px] left-[10px] cursor-pointer bg-[#007bff] flex items-center justify-center rounded-full outline-none transition-all duration-500"
      >
        {isSidebarOpen ? (
          <RiArrowLeftSFill className="text-white w-5 h-5" />
        ) : (
          <RiArrowRightSFill className="text-white w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
