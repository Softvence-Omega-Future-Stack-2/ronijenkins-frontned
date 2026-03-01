
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
import CreateContentForm from "../Component/ContentCms/CreatEditContent";
import EditContentForm from "../Component/ContentCms/EditContent";



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
          { path: "add-brodcast", element: <CreateBroadcast /> },
        //   { path: '', element: <Dashboard /> },
       { path: "users-managment", element: <UserManagmentPage /> },
       { path: "users-managment/:id", element: <UserProfileDetail/> },

       { path: "content-cms", element: <ContentCms /> },
       { path: "create-content", element: <CreateContentForm /> },
       { path: "edit-content/:id", element: <EditContentForm /> },
   
       { path: "ai-logic", element: <AiLogic/> },
       { path: "subscription", element: <Subscription /> },
      //  { path: "logout", element: <ProfilePage /> },
           
        ],
      },
    ],
  },
]);

export default routes;
