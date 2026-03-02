import { Link, NavLink } from "react-router-dom";
import { FiHome, FiArchive, FiFileText } from "react-icons/fi";
import { useContext } from "react";
import { bugContext } from "../utils/Mycontext";

function SideNavLink({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative overflow-hidden w-full sm:w-auto lg:w-full font-medium leading-none text-[0.95rem] flex items-center gap-1.5 p-2.5 rounded-lg transition-colors duration-200 ${
          isActive ? "text-black" : "text-zinc-700 hover:text-black"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute inset-0 bg-zinc-300 rounded-lg transition-all duration-200 ease-out ${
              isActive
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            }`}
          ></span>
          <span className="relative z-10 flex-shrink-0 top-[1px]">{icon}</span>
          <span className="relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Leftnav() {
  const { bugs } = useContext(bugContext);

  return (
    <div className="w-full lg:w-56 xl:w-72 lg:min-h-screen lg:max-h-screen px-3 py-3.5 sm:px-4 lg:px-5 lg:pt-3.5 flex flex-col border-b border-zinc-300 lg:border-b-0 lg:border-r bg-white">
      <div className="flex gap-2 w-full items-center">
        <img src="/logo.png" alt="logo" className="w-6" />
        <span className="text-base font-bold">Bug Diary</span>
        <span className="ml-auto text-xs text-zinc-500 lg:hidden">
          {bugs.length} bugs
        </span>
      </div>
      <hr className="-mx-3 sm:-mx-4 lg:-mx-5 mt-2.5 w-auto text-zinc-100" />
      <div className="w-full mt-3.5 flex flex-wrap gap-1.5">
        <SideNavLink to="/" icon={<FiHome />} label="Home" end />
        <SideNavLink to="/archive" icon={<FiArchive />} label="Archive" />
        <SideNavLink
          to="/dashboard"
          icon={<i className="ri-dashboard-line"></i>}
          label="DashBoard"
        />
        <SideNavLink to="/drafts" icon={<FiFileText />} label="Drafts" />
      </div>

      <h1 className="mt-4 font-semibold text-[0.98rem] text-zinc-600 hidden lg:block">
        My Bugs <span>({bugs.length})</span>
      </h1>
      <div className="mt-2.5 w-full hidden lg:block flex-1 min-h-0 border-y border-zinc-100 overflow-y-auto overflow-x-hidden">
        {bugs.map((item, index) => (
          <Link
            key={index}
            to={`/${item.bugId}/bugdetails`}
            className="font-normal leading-none text-zinc-700 text-[0.92rem] flex items-center gap-2 p-2.5 rounded-lg duration-300 hover:text-black hover:bg-zinc-300"
          >
            <span className="truncate">{item.title}</span>
          </Link>
        ))}
      </div>
      <Link className="mt-3.5 lg:mt-auto w-full h-10 text-[0.92rem] text-zinc-500 hidden lg:flex justify-center items-center">
        <i className="ri-question-line mr-1 w-5"></i>
        <span className="w-full">Help & Support</span>
      </Link>
    </div>
  );
}
