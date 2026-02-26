import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
