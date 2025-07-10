import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-14 md:ml-64 overflow-y-auto p-6">
        <div className="min-h-full flex flex-col rounded-xl text-gray-100 bg-gradient-to-br from-gray-800 to-gray-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
