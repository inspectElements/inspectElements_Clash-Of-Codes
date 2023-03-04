import { createBrowserRouter } from "react-router-dom";
import Login from "../screens/home/Login";
import Home from "../screens/home/Home";
import CreateAccount from "../screens/account/CreateAccount";
import KYC from "../screens/account/KYC";
import Dashboard from "../screens/dashboard/Dashboard";
import Transact from "../screens/dashboard/Transact";
import Loan from "../screens/dashboard/Loan";
import LoanApply from "../screens/dashboard/LoanApply";
import LoanRepay from "../screens/dashboard/LoanRepay";
import Trade from "../screens/dashboard/Trade";
import ApproveAcount from "../screens/admin/Acount";
import ApproveLoan from "../screens/admin/Loan";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/create",
    element: <CreateAccount />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/kyc",
    element: <KYC />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/transact",
    element: <Transact />,
  },
  {
    path: "/dashboard/loan",
    element: <Loan />,
  },
  {
    path: "/dashboard/loan/apply",
    element: <LoanApply />,
  },
  {
    path: "/dashboard/loan/repay",
    element: <LoanRepay />,
  },
  {
    path: "/dashboard/trade",
    element: <Trade />,
  },
  {
    path: "/admin/approve-acount",
    element: <ApproveAcount />,
  },
  {
    path: "/admin/approve-acount",
    element: <ApproveLoan />,
  },
]);