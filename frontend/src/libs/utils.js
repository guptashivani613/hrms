// function for next page when user is login or user profile get updated
import React from "react";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import queryString from "query-string";
import moment from "moment";
// import { startRatingColors, startRatingBgColors } from "../libs/constant";


const startRatingColors = "#212121"
const startRatingBgColors = "#212121"
// toast.configure({
//   autoClose: 5000,
//   hideProgressBar: true,
//   closeOnClick: true,
//   pauseOnHover: true,
//   draggable: true,
//   // position: toast.POSITION.BOTTOM_LEFT,
// });

export const nextPageUrl = (
  business_type,
  is_superuser,
  screen_name,
  business,
  corporate_branch,
  marketing_id,
  is_business_owner,
  multi_business_access
) => {
  const pageSize = cookie.load("pageSize") || {};

const user = cookie.load("user");
  let nextPage;
  if (business_type !== "marketing" && business == null) {
    nextPage = "/contact";
  } else if (screen_name.includes("PROFILE")) {
    nextPage = "/profile";
  } else if (is_superuser) {
    nextPage = `/admin?page_size=${pageSize.business_list || 10}`;
  } else if (business_type == "marketing") {
    nextPage = "/" + marketing_id + "/agency-brands";
  } else if (!corporate_branch) {
    nextPage = is_business_owner ? "/" + business + "/" + "branch-setup" : "/contact";
  } else if (business_type !== "marketing" && multi_business_access === true) {
    nextPage = "/" + marketing_id + "/agency-staff-dashboard";
  } else {
    // check for the dashboard page or business setup page
    nextPage = "/" + business;
    if (screen_name.includes("BUSINESS_BRANCH")) {
      nextPage += "/" + corporate_branch + "/business-profile";
    } else {
      user?.enable_sr_module_only ? nextPage += "/ticket-service-overview?date_type=prior_30_day" : nextPage += "/dashboard?date_type=prior_30_day";
    }
  }
  return nextPage;
};

export const clearCookie = () => {
  cookie.remove("authToken", { path: "/" });
  cookie.remove("user", { path: "/" });
  cookie.remove("business_user", { path: "/" });
  cookie.remove("screens", { path: "/" });
  cookie.remove("branch", { path: "/" });
  cookie.remove("service_category", { path: "/" });
};

export const maxValueOfArray = (arr) => {
  const max =
    arr &&
    arr.length &&
    arr.reduce(function (a, b) {
      return Math.max(a, b);
    });
  return max;
};

export const format = (str, arr) =>
  arr?.length > 1 ? format(str.replace("{}", arr[0]), arr.slice(1)) : (arr[0] && str.replace("{}", arr[0])) || str;

export const isContainsubString = (subStirng) => (element) => {
  return element.address.toLowerCase().includes(subStirng.toLowerCase());
};

export const getsmileyIcon = (value) => {
  let smiley;
  if (value) {
    if (value === "0") smiley = "frown";
    if (value === "1") smiley = "meh rolling eyes";
    if (value === "2") smiley = "smile";
  }
  return smiley;
};

const smiley = ["frown", "meh rolling eyes", "smile"];
export const getSmileyType = (value) => {
  return smiley[Number(value)];
};

const CloseButton = ({ closeToast }) => (
  <span className="material-icons m-auto">
    {/* <CloseIcon onClick={closeToast} role="button" /> */}
  </span>
);

const renderMessage = (type, message) => (
  <div className="d-flex align-items-center gap-10">
    {/* <span>{type === "success" ? <DoneAllOutlinedIcon /> : <ErrorOutlineIcon />}</span> */}
    <span>{message}</span>
  </div>
);

export const displayMessage = (messageType, message) => {
  if (messageType === "positive")
    return toast.success(renderMessage("success", message), {
      closeButton: <CloseButton />,
    });
  else if (messageType === "negative")
    return toast.error(renderMessage("error", message), {
      closeButton: <CloseButton />,
    });
  else
    return toast.info(renderMessage("info", message), {
      closeButton: <CloseButton />,
    });
};

const renderToast = (type, message) => (
  <div className="d-flex align-items-center gap-10">
    <span>
      {/* {type === "success" ? <CheckCircleIcon style={{ color: "#00b5ad", fontSize: "18px" }} /> : <CheckCircleIcon />} */}
    </span>
    <span>{message}</span>
  </div>
);

export const showToast = (messageType, message) => {
  if (messageType === "positive")
    return toast.success(renderToast("success", message), {
      position: "top-center",
      closeButton: false,
      className: "copy-link-toaster",
    });
};

export const toggleSort = (history, location, on) => {
  const { pathname, search } = location;
  const query = queryString.parse(search);
  const ordering = query && query.ordering && query.ordering === on && query.ordering[0] !== "-" ? "-" + on : on;
  history.push({
    pathname,
    search: queryString.stringify({ ...query, ordering }),
  });
};

export const trendsDateType = (value) => {
  switch (value) {
    case "today":
      return "Yesterday";
    case "yesterday":
      return "Day Before Yesterday";
    case "prior_30_day":
      return "Past 30 Days";
    case "current_month":
      return "Last Month";
    case "prior_2_month":
      return "Past 2 months";
    case "prior_3_month":
      return "Past 3 months";
    case "prior_6_month":
      return "Past 6 months";
    case "current_year":
      return "Last Year";
  }
  return "Past 7 days";
};

export const currency_symbols = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  CRC: "₡", // Costa Rican Colón
  GBP: "£", // British Pound Sterling
  ILS: "₪", // Israeli New Sheqel
  INR: "₹", // Indian Rupee
  JPY: "¥", // Japanese Yen
  KRW: "₩", // South Korean Won
  NGN: "₦", // Nigerian Naira
  PHP: "₱", // Philippine Peso
  PLN: "zł", // Polish Zloty
  PYG: "₲", // Paraguayan Guarani
  THB: "฿", // Thai Baht
  UAH: "₴", // Ukrainian Hryvnia
  VND: "₫", // Vietnamese Dong
  AED: "د.إ", // United Arab Emirates
  IDR: "Rp", // Indonesian Rupiah
  SGD: "S$", // Singapore dollar
  MYR: "RM", // Malaysian Ringgits
  AUD: "a$", // Australian Dollar
};

export const kFormatter = (value) => {
  const values = [
    [1000000, "M"],
    [1000, "K"],
  ];
  for (var i = 0; i < values.length; i++) {
    if (value >= values[i][0]) {
      return `${(value / values[i][0]).toFixed(1)}${values[i][1]}`;
    }
  }
  return value;
};

export function snakeToCapital(str) {
  return (
    str &&
    (str
      .replace(/(^\w)/g, (g) => g[0].toUpperCase())
      .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
      .trim() ||
      str)
  );
}

export function setDecimalIndex(value, index) {
  if (isNaN(value)) {
    return "";
  }
  return value ? parseFloat(value.toString()).toFixed(index || 1) : value;
}

export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

export function getParams(url, param) {
  const params = new URLSearchParams(url);
  return params.get(param);
}

export function getAllParamsInArrayForm(url) {
  const parsedParams = queryString.parseUrl(url).query;
  const formattedParams = Object.entries(parsedParams).reduce((acc, [key, value]) => {
    if (value && value.includes(",")) {
      acc[key] = value.split(",");
    } else {
      acc[key] = value || value === "" ? [value] : [];
    }
    return acc;
  }, {});
  return formattedParams;
}

export function setDateFormat(date, format) {
  return moment(date).format("DD/MM/YYYY" || format);
}

export function isActivePage(router) {
  return window.location.pathname.includes(router);
}

export const getQueryParams = (filterObj) => {
  const existingParams = getAllParamsInArrayForm(window.location.search);
  const paramsList = {};
  const mergeParams = Object.assign(existingParams, filterObj);
  Object.keys(mergeParams)
    .filter((key) => filterObj[key] && filterObj[key].length)
    .map((key) => {
      paramsList[key] = filterObj[key].map((item) => item.value).join(",");
    });
  return queryString.stringify(paramsList);
};

export function setToLocalStringNumber(value) {
  const formatter = Intl.NumberFormat("en-IN", { notation: "standard" });
  return formatter.format(+value);
}

// Remove null or empty value
export const sanitizeObject = (valueObj) => {
  return Object.fromEntries(
    Object.entries(valueObj).filter(
      // eslint-disable-next-line no-unused-vars
      ([_key, value]) => value !== "" && value !== null && value !== undefined
    )
  );
};
/**
 * Checks if any key in the given object has a truthy value.
 * @param {Object} obj - The input object to be checked.
 * @returns {boolean} - True if any key has a truthy value, otherwise false.
 */
export function hasTruthyValue(obj) {
  return Object.values(obj).some((value) => {
    if (Array.isArray(value) && value.length > 0) {
      return true;
    } else if (typeof value === "object" && value !== null) {
      const hasTruthyInnerValue = Object.values(value).some((innerValue) => innerValue !== "");
      return hasTruthyInnerValue;
    }
    return !!value;
  });
}

/**
 * Checks if two objects are equal by comparing their JSON representations.
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @returns {boolean} - True if both objects are equal, otherwise false.
 */
export function areObjectsEqualJSON(obj1, obj2) {
  const jsonString1 = JSON.stringify(obj1);
  const jsonString2 = JSON.stringify(obj2);
  return jsonString1 === jsonString2;
}

// => current page: reviewPage, input : 2 ,  o/p => review
export const getStaticPathString = (index) => window.location.pathname.split("/")[index];

export function starRatingColor(value) {
  const isDecimal = Number.parseFloat(value).toFixed(2).split(".")[1] !== "00";
  const starRatingColorsIndex = isDecimal ? Math.floor(value) : Math.floor(value) - 1 || 0;
  // const starRatingColorsIndex =  Math.floor(value) - 1 || 0;
  const star_border_color = startRatingColors[starRatingColorsIndex] || 5;
  const star_bg_color = startRatingBgColors[starRatingColorsIndex] || 5;

  return { star_border_color, star_bg_color };
}

export const getPercentage = (currentValue, totalValue) => {
  const percentage = currentValue ? (totalValue / currentValue) * 100 : 0;
  return percentage < 1 ? setDecimalIndex(percentage, 2) : Math.floor(percentage);
};

// Common function for apply color to Sorting
export const sortChangeColor = (Color, backgroundColor) => {
  return {
    color: Color,
    backgroundColor: backgroundColor,
  };
};

export const gradingData = [
  {
    grading: "F",
    status: "Very Poor",
    count: "1-30",
  },
  {
    grading: "D",
    status: "Poor",
    count: "31-40",
  },
  {
    grading: "C",
    status: "Below Average",
    count: "41-50",
  },
  {
    grading: "C+",
    status: "Average",
    count: "51-60",
  },
  {
    grading: "B",
    status: "Good",
    count: "61-70",
  },
  {
    grading: "B+",
    status: "Very Good",
    count: "71-80",
  },
  {
    grading: "A",
    status: "Excellent",
    count: "81-90",
  },
  {
    grading: "A+",
    status: "Outstanding",
    count: "91-100",
  },
];

export const scrollToFirstElement = (className) => {
  const firstElement = document.getElementsByClassName(className)[0];
  console.log("firstElement", firstElement);
  firstElement?.scrollIntoView({
    block: "start",
    inline: "start",
    behavior: "smooth",
  });
};

export const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast("positive", "Link has been copied");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

export const avatarText = (text) => {
  if (text) {
    const splitText = text?.split(" ");
    return splitText?.length > 1 ? splitText[0][0] + splitText[1][0] : text[0][0];
  } else {
    return "";
  }
};

export function findMaxAndIndex(arr) {
  if (arr.length === 0) {
    return null;
  }

  let maxValue = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
      maxIndex = i;
    }
  }

  return {
    value: maxValue,
    index: maxIndex,
  };
}

export const handleDefaultFilter = (list, key) => {
  const filter = window.location.search;
  const defaultFilter = getAllParamsInArrayForm(filter);
  const isKeyFilterAvailable = defaultFilter && defaultFilter[key] && defaultFilter[key].length;
  return list.map((item) => {
    item["isChecked"] = isKeyFilterAvailable && defaultFilter[key].includes(item.value.toString());
    item["parentKey"] = key;
    return item;
  });
};

export function removeNullValues(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null));
}
