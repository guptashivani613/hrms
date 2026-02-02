import { Switch, Route } from "react-router-dom";
import ViewEmployees from "../components/hr_admin_component/employees/ViewEmployees";
import Dashboard from "../components/employee_component/dashboard/Dashboard";
import Profile from "../components/employee_component/dashboard/Profile";
import UpcomingHolidays from "../components/employee_component/dashboard/UpcomingHolidays";
import EmployeesSalaryDetails from "../components/hr_admin_component/salary/EmployeesSalaryDetails";
import EmployeeManager from "../components/hr_admin_component/employees/EmployeeManager";
import AddLeave from "../components/hr_admin_component/leave_policy/AddLeave";

const AppTemplateRouter = () => {
  return (
    <Switch>
      <Route path="/hr/salary" component={EmployeesSalaryDetails} />
      <Route path="/hr/view-employees" component={ViewEmployees} />
      <Route path="/hr/leave-policy" component={AddLeave} />
      <Route path="/hr/add-employee" component={EmployeeManager} />
      <Route path="/hr/dashboard" component={Dashboard} />
      <Route path="/hr/profile" component={Profile} />
      <Route path="/hr/holidays" component={UpcomingHolidays} />
    </Switch>
  );
}

export default AppTemplateRouter;