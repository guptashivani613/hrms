/* eslint-disable no-case-declarations */
import {store} from '../redux/store';
import { logout } from '../redux/auth/authSlice';
import axios from "axios";
import Cookies from "js-cookie";
import * as utils from "./utils";

let axios_instance = axios.create();

const getUserData = () => {
  const userData = Cookies.get("userData");
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to parse userData:", error);
    return null;
  }
};

const clearCookies = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("userData");
};

// Axios request interceptor
axios_instance.interceptors.request.use(
  (configuration) => {
    const config = configuration;
    const token = Cookies.get("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["ngrok-skip-browser-warning"] = "any";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor
axios_instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("Network error or no response from server");
      return Promise.reject(error);
    }

    const status = error.response.status;

    const userData = getUserData();
    switch (status) {
      case 401:
        store.dispatch(logout());
        utils.displayMessage("negative", "Unauthorized");
        clearCookies()
        window.location.href = "/";
        break;

      case 402:
        utils.displayMessage("negative", "Payment is required");
        if (userData && userData.type === "HR") {
          window.location.href = `/${userData.user_id}/payments`;
        }
        break;

      case 403:
        const err = { response: { data: "lock" } };
        return Promise.reject(err);

      case 404:
        if (!Array.isArray(error?.response?.data)) {
          return Promise.reject(error);
        } else {
          utils.displayMessage("negative", "Not Found");
          return Promise.reject(error);
        }

      case 500:
        utils.displayMessage("negative", "Server Error");
        break;

      default:
        const errorMessages = error.response?.data && Object.values(error.response.data)[0];
        const message = Array.isArray(errorMessages) ? errorMessages.join(", ") : errorMessages;
        message && utils.displayMessage("negative", message);
    }

    return Promise.reject(error);
  }
);


export default axios_instance;
