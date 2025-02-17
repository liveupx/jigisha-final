
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = ({ title }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header title={title} />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;