const SERVER_URL = process.env.REACT_APP_API_URL;

module.exports = {
  HR_REGISTER_OTP: `${SERVER_URL}api/accounts/users/send-otp/`,
  HR_REGISTER_OTP_VERIFY: `${SERVER_URL}api/accounts/users/verify-otp/`,
  USER_FIND:`${SERVER_URL}api/accounts/users/`,
  LOGIN_USER_DETAILS:`${SERVER_URL}api/home/login/user-details/`,
  HR_LOGIN: `${SERVER_URL}api/accounts/login/`,
  HR_FORGET_PASS: `${SERVER_URL}api/accounts/forgot-password/`,
  HR_RESET_PASS: `${SERVER_URL}api/accounts/reset-password/`,
  HR_DETAILS: `${SERVER_URL}api/home/hr/details/`,
  HR_DETAILS_ADD: `${SERVER_URL}api/accounts/hr/hrs/`, //put/post
  ALL_EMPLOYEE_DETAILS: `${SERVER_URL}api/accounts/employee/`, //get/delete
  EMPLOYEE_DETAILS_ADD: `${SERVER_URL}api/accounts/employee/`,//post
  MANAGER_DETAILS_ADD: `${SERVER_URL}api/accounts/manager/managers/`, //post
  EMPLOYEE_COUNT: `${SERVER_URL}api/accounts/employee-count/`,
  MONTHLY_SALARY_STATUS: `${SERVER_URL}api/salary/monthly-salary/`,//get/post
  ALL_EMPLOYEE_SALARY_DETAILS: `${SERVER_URL}api/salary/salary/`, //get/post
  HOLIDAY_LIST: `${SERVER_URL}api/home/holidays/`, //get/post
  MONTHLY_PAYSLIP: `${SERVER_URL}api/salary/monthly-salary/payslip/`,
  ADD_BANK_DETAILS: `${SERVER_URL}api/salary/bank-details/`, //get/post
  LOGIN_EMP_SALARY: `${SERVER_URL}api/salary/employee/salary-details/`,
  LOGIN_EMP_BANK_DETAILS: `${SERVER_URL}api/salary/get-bank-details/user_bank_details/`,
  LOGIN_EMP_ALL_SALARY_PAYSLIP: `${SERVER_URL}api/salary/monthly-salary/user_salary/`,
  LOGIN_EMPLOYEE_DASHBOARD: `${SERVER_URL}api/home/employee/details/`,
  HR_REGISTER_EMP_LEAVE: `${SERVER_URL}api/home/leave-balances/`, //get/post
  LOGIN_EMPLOYEE_LEAVE_APPLY: `${SERVER_URL}api/home/leaves/`, //get/post
  ANNOUNCEMENTS: `${SERVER_URL}api/home/announcements/`,
  ATTENDANCE: `${SERVER_URL}api/home/attendance/`,
  EMERGENCY_CONTACT: `${SERVER_URL}api/accounts/emergency-contacts/`,
  EDUCATION: `${SERVER_URL}api/accounts/education/`,
  EXPERIENCE: `${SERVER_URL}api/accounts/experience/`,

}