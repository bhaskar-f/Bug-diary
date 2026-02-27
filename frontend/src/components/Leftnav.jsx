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
        `group relative overflow-hidden font-medium leading-none text-[1.02rem] flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 ${
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
    <div className="w-[20%] h-full  p-6 pt-4 flex flex-col  border-r-1 border-zinc-300">
      <div className="flex gap-2 w-full -p-5  items-center">
        <img src="/logo.png" alt="logo" className="w-7" />
        <span className="text-lg font-bold">Bug Diary</span>
      </div>
      <hr className="-mx-6 mt-3 w-auto text-zinc-100" />
      <div className="w-full mt-5 flex flex-col gap-2">
        <SideNavLink to="/" icon={<FiHome />} label="Home" end />
        <SideNavLink to="/archive" icon={<FiArchive />} label="Archive" />
        <SideNavLink
          to="/dashboard"
          icon={<i className="ri-dashboard-line"></i>}
          label="DashBoard"
        />
        <SideNavLink to="/drafts" icon={<FiFileText />} label="Drafts" />
      </div>

      <h1 className="mt-5 font-semibold text-[1.1rem] text-zinc-600">
        My Bugs <span>({bugs.length})</span>
      </h1>
      <div className="mt-3 w-full h-[80%] border-t-1 border-b-1 border-zinc-100 overflow-y-auto overflow-x-hidden">
        {bugs.map((item, index) => (
          <Link
            key={index}
            to={`/${item.bugId}/bugdetails`}
            className="font-normal  leading-none text-zinc-700 flex items-center gap-2  p-3 rounded-lg  duration-300 hover:text-black hover:bg-zinc-300"
          >
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
      <Link className="mt-auto w-full h-15 text-zinc-500 flex justify-center items-center">
        <i className="ri-question-line mr-1 w-5"></i>
        <span className="w-full">Help & Support</span>
      </Link>
    </div>
  );
}
