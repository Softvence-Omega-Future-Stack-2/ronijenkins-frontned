
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardLayout from "../layout/DashboardLayout";

import UserManagmentPage from "../pages/UserManagmentPage";

import GlobalOverview from "../pages/GlobalOverview";
import ContentCms from "../pages/ContentCms";
import AiLogic from "../pages/AILogic";
import Subscription from "../pages/Subscription";



const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <GlobalOverview /> },
        //   { path: '', element: <Dashboard /> },
       { path: "users-managment", element: <UserManagmentPage /> },
       { path: "content-cms", element: <ContentCms /> },
   
       { path: "ai-logic", element: <AiLogic/> },
       { path: "subscription", element: <Subscription /> },
      //  { path: "logout", element: <ProfilePage /> },
           
        ],
      },
    ],
  },
]);

export default routes;
