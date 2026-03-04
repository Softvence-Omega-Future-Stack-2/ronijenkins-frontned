
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardLayout from "../layout/DashboardLayout";

import UserManagmentPage from "../pages/UserManagmentPage";

import GlobalOverview from "../pages/GlobalOverview";
import ContentCms from "../pages/ContentCms";
import AiLogic from "../pages/AILogic";
import Subscription from "../pages/Subscription";
import CreateBroadcast from "../Component/globalOverview/CreateBroadcast";
import UserProfileDetail from "../Component/userManagment/UserDetails";
import CreateContentForm from "../Component/ContentCms/CreateContent";
import EditContentForm from "../Component/ContentCms/EditContent";
import NotificationPage from "../pages/NotificationPage";
import LoginPage from "../auth/Login";
import ForgotPasswordPage from "../auth/ForgetPassword";
import OTPVerificationPage from "../auth/VerifyOTP";
import ResetPasswordPage from "../auth/ResetPassword";
import AdminProfile from "../pages/AdminProfile";
import EditProfile from "../pages/EditProfile";



const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
          path: '/',
          element:<LoginPage/>
        },
        {
          path: '/forgot-password',
          element:<ForgotPasswordPage/>
        },
        {
          path: '/otp-verification',
          element:<OTPVerificationPage/>
        },
        {
          path: '/reset-password',
          element:<ResetPasswordPage/>
        },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <GlobalOverview /> },
          { path: "add-brodcast", element: <CreateBroadcast /> },
        //   { path: '', element: <Dashboard /> },
       { path: "users-managment", element: <UserManagmentPage /> },
       { path: "users-managment/:id", element: <UserProfileDetail/> },

       { path: "content-cms", element: <ContentCms /> },
       { path: "create-content", element: <CreateContentForm /> },
       { path: "edit-content/:id", element: <EditContentForm /> },
   
       { path: "ai-logic", element: <AiLogic/> },
       { path: "subscription", element: <Subscription /> },
       { path: "notifications", element: <NotificationPage/> },
       { path: "profile", element: <AdminProfile/> },
       { path: "edit_profile", element: <EditProfile/> },

      //  { path: "logout", element: <ProfilePage /> },
           
        ],
      },
    ],
  },
]);

export default routes;
