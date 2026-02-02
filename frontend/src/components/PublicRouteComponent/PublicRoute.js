import React from "react";
import { Redirect, Route } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ component: Component, restricted = false, ...rest }) => {
  // const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const token = Cookies.get("access_token");
  const userType = Cookies.get("userType");

  return (
    <Route
      {...rest}
      render={(props) =>
        token && userType==='hr' && restricted ? (
          <Redirect to="/hr/dashboard" />
        ) 
        : token && userType==='employ' && restricted 
        ? <Redirect to="/employ/dashboard" />
        : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
