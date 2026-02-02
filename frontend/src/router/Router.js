import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddEmployee from "../components/hr_admin_component/employees/AddEmployee";
import ViewEmployees from "../components/hr_admin_component/employees/ViewEmployees";
import Salary from "../components/hr_admin_component/salary/Salary";
import Dashboard from "../components/employee_component/dashboard/Dashboard";
import HomePage from "../pages/homepage/HomePage";
import HrRegisterPage from "../pages/accounts/HrRegisterPage";
import AppTemplatePage from "../pages/common/AppTemplatePage";
import { EmployPrivateRoute, HrPrivateRoute } from "../components/PrivateRouteComponent/PrivateRoute";
import PublicRoute from "../components/PublicRouteComponent/PublicRoute";
import EmployTemplatePage from "../pages/common/EmployTemplatePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute exact path="/" component={HomePage} restricted={true}/>
        <PublicRoute path="/register" component={HrRegisterPage} restricted={true}/>

        {/* Protected Routes */}
        <HrPrivateRoute path="/hr" component={AppTemplatePage} />
        <EmployPrivateRoute path="/employ" component={EmployTemplatePage} />
        {/* 404 Catch-all Route */}
        <Route path="*">
         <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
