import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { LiaLanguageSolid } from "react-icons/lia";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useHistory, useLocation } from "react-router-dom";
import { logout } from "../../../redux/auth/authSlice";
import Cookies from 'js-cookie';
import axios_instance from "../../../libs/interseptor";
import * as URLS from "../../../libs/apiUrls";

function Navbar() {
  const dispatch = useDispatch()
  const history = useHistory();
  const [userDetails, setUserDetails] = useState([])
  const userType = Cookies.get('userType')
  const storedUserData = JSON.parse(Cookies.get("userData"));
  const name = storedUserData?.first_name + " " + storedUserData?.last_name

  const handleLogout = () => {
    dispatch(logout())
    history.push("/");
  };

  const get_user_profile = async () => {
    try {
      let response;
      if (userType === 'hr') {
        response = await axios_instance.get(URLS.HR_DETAILS);
      } else if (userType === 'employ') {
        response = await axios_instance.get(URLS.LOGIN_EMPLOYEE_DASHBOARD);
      }
      if (response) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile details:", error);
    }
  };

  useEffect(() => {
    get_user_profile();
  }, []);

  return (
    <header className='z-50 bg-white sticky top-0 pt-4' style={{ borderBottom: '0.1px solid lightgray' }}>
      <div className='flex flex-wrap items-center w-full relative tracking-wide'>
        <div className='flex items-center gap-y-6 max-sm:flex-col z-50 w-full pb-2'>

          <div className="flex items-center justify-end gap-6 ml-auto">

              <p className="flex items-center font-extralight"><LiaLanguageSolid className="text-2xl" />EN</p>
              <a href="https://workplace.zoho.in/" className="flex items-center text-2xl gap-1 text-gray-500"><HiOutlineMail /></a>
              
            <div className="dropdown-menu relative flex shrink-0 group mr-4 cursor-pointer">
              <div className="flex items-center gap-4 px-4">
                <p className="text-gray-500 text-sm">Hi, <span className="font-bold capitalize">{userDetails?.firstname ? userDetails.firstname : userDetails?.first_name} {userDetails?.lastname ? userDetails.lastname : userDetails?.last_name}</span></p>
                {
                  userDetails && userDetails?.profilePic ? <img src={userDetails.profilePic} alt="profile-pic"
                    className="w-[38px] h-[38px] rounded-full border-2 border-gray-300 cursor-pointer"
                  />
                    :
                    <div
                      className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-blue-400 text-white font-bold border-2 border-gray-300 cursor-pointer"
                    >
                      {userType === 'hr' ?
                        userDetails?.firstName? 
                          userDetails.firstName[0].toUpperCase() : userDetails?.first_name ? userDetails.first_name[0].toUpperCase() : userDetails?.firstname ? userDetails?.firstname[0].toUpperCase() : "N/A"
                        :
                          userDetails?.firstname?
                          userDetails?.firstname[0].toUpperCase() : userDetails?.first_name ? userDetails.first_name[0].toUpperCase() : userDetails?.lastname ? userDetails?.lastname[0].toUpperCase() : "N/A"
                          }
                          
                    </div>
                }
              </div>

              <div
                className="dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-[38px] right-0 w-56">
                <div className="w-full space-y-2">
                  <a href={userType === 'hr' ? "/hr/profile" : userType === 'employ' ? "/employ/profile" : ""}
                    className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-[#d9f3ea] dropdown-item transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] mr-4 fill-current"
                      viewBox="0 0 512 512">
                      <path
                        d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                        data-original="#000000"></path>
                    </svg>
                    Account</a>
                  <hr className="my-2 -mx-2" />
                  <a href="javascript:void(0)" onClick={handleLogout}
                    className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-[#d9f3ea] dropdown-item transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] mr-4 fill-current"
                      viewBox="0 0 6 6">
                      <path
                        d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                        data-original="#000000" />
                    </svg>
                    Logout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
