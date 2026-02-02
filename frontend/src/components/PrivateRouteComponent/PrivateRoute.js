import React from "react";
import Cookies from "js-cookie";
import { Redirect, Route } from "react-router-dom";
import Navbar from "../hr_admin_component/navbar/Navbar";
import Sidebar from "../common/Sidebar";

const getAuthToken = () => {
  return Cookies.get("access_token") || null;
};

export const HrPrivateRoute = ({ component: Component, ...rest }) => {
  const token = getAuthToken();
  const userType = Cookies.get("userType");
  return (
    <Route
      {...rest}
      render={(props) =>
        token && userType !== "employ" ? (
          <div className="grid grid-cols-[auto,1fr] h-[100vh]">
            <div className="bg-white">
              <Sidebar />
            </div>
            
            <div className="overflow-auto shadow-sm ">
              <Navbar />
              <div className="bg-white">
                <Component {...props} />
              </div>
            </div>
          </div>

        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};


export const EmployPrivateRoute = ({ component: Component, ...rest }) => {
  const token = getAuthToken();
  const userType = Cookies.get("userType");
  return (
    <Route
      {...rest}
      render={(props) =>
        token && userType === 'employ' ? (
          <div className="grid grid-cols-[auto,1fr] h-screen">
            {/* Sidebar */}
            <div className="bg-white">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="overflow-auto shadow-sm ">
              <Navbar />
              <div className="bg-white">
                <Component {...props} />
              </div>
            </div>
          </div>

        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

