import { NavLink, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, LogOut } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="fixed flex flex-col left-0 w-14 hover:w-64 md:w-64 bg-gradient-to-br from-gray-800 to-gray-900 h-full text-white transition-all duration-300 border-none z-20 sidebar rounded-xl my-4 ml-4 overflow-hidden">
      <div className="flex flex-col justify-between flex-grow overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col py-4 space-y-1">
          {/* Profile Header */}
          <li className="px-5 hidden md:block">
            <div className="flex flex-row items-center h-14 justify-center border-b pb-5 mb-5">
              <div className="flex items-center text-white font-bold">
                <div className="mr-4">
                  <img
                    className="w-10 h-10 rounded-[.95rem] object-cover"
                    src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
                    alt="avatar"
                  />
                </div>
                <div className="uppercase">
                  Islam Baidaq
                  <span className="block text-[0.85rem] text-gray-400 font-medium">
                    SR. SW Engineer
                  </span>
                </div>
              </div>
            </div>
          </li>

          {/* Dashboard Link */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                [
                  "relative flex flex-row items-center h-11 md:mx-4 px-4 rounded-xl transition-colors duration-200",
                  "border-l-4",
                  isActive
                    ? "bg-gray-700 text-white border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-600 border-transparent",
                ].join(" ")
              }
            >
              <span className="inline-flex justify-center items-center">
                <Home className="w-5 h-5" />
              </span>
              <span className="ml-3 text-sm tracking-wide truncate">
                Dashboard
              </span>
            </NavLink>
          </li>

          {/* URL Manager Link */}
          <li>
            <NavLink
              to="/url-manager"
              className={({ isActive }) =>
                [
                  "relative flex flex-row items-center h-11 md:mx-4 px-4 rounded-xl transition-colors duration-200",
                  "border-l-4",
                  isActive
                    ? "bg-gray-700 text-white border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-600 border-transparent",
                ].join(" ")
              }
            >
              <span className="inline-flex justify-center items-center">
                <LayoutDashboard className="w-5 h-5" />
              </span>
              <span className="ml-3 text-sm tracking-wide truncate">
                URL Management
              </span>
            </NavLink>
          </li>
        </ul>

        {/* Logout Button */}
        <ul className="pb-4 space-y-1">
          <li className="md:flex justify-center">
            <button
              onClick={handleLogout}
              className="relative  flex flex-row justify-center items-center h-11 md:mx-4 px-5  w-full mb-10 cursor-pointer rounded-xl transition-colors duration-200 text-white bg-gray-600 border-l-4 border-transparent "
            >
              <span className="inline-flex justify-center items-center">
                <LogOut className="w-5 h-5" />
              </span>
              <span className="ml-3 text-sm tracking-wide truncate">
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
