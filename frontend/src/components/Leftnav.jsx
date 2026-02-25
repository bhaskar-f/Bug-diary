import { Link } from "react-router-dom";
import { FiHome, FiPlusCircle, FiArchive } from "react-icons/fi";

export default function Leftnav() {
  return (
    <div className="w-[20%] h-full  p-6  flex flex-col  border-r-1 border-zinc-300">
      <div className="flex gap-2 w-full -p-3  items-center">
        <img src="/logo.png" alt="logo" className="w-7" />
        <span className="text-lg font-bold">Bug Diary</span>
      </div>
      <hr className="-mx-6 mt-5 w-auto text-zinc-100" />
      <div className="w-full mt-10 flex flex-col gap-2">
        <Link
          to="/"
          className="group relative overflow-hidden font-medium text-zinc-700 hover:text-black leading-none text-[1.02rem]
             flex items-center gap-2 p-3 rounded-lg transition-colors duration-200"
        >
          <span className="absolute inset-0 bg-zinc-300 rounded-lg scale-95 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100"></span>

          <FiHome className="relative z-10 flex-shrink-0 top-[1px]" />
          <span className="relative z-10">Home</span>
        </Link>
        <Link
          to="/archive"
          className="group relative overflow-hidden font-medium text-zinc-700 hover:text-black leading-none text-[1.02rem]
             flex items-center gap-2 p-3 rounded-lg transition-colors duration-200"
        >
          <span className="absolute inset-0 bg-zinc-300 rounded-lg scale-95 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100"></span>

          <FiArchive className="relative z-10 flex-shrink-0 top-[1px]" />
          <span className="relative z-10">Archive</span>
        </Link>
        <Link
          to="/dashboard"
          className="group relative overflow-hidden font-medium text-zinc-700 hover:text-black leading-none text-[1.02rem]
             flex items-center gap-2 p-3 rounded-lg transition-colors duration-200"
        >
          <span className="absolute inset-0 bg-zinc-300 rounded-lg scale-95 opacity-0 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100"></span>

          <i className="ri-dashboard-line relative z-10 flex-shrink-0 top-[1px]"></i>
          <span className="relative z-10">DashBoard</span>
        </Link>
      </div>

      <h1 className="mt-5 font-semibold text-[1.1rem] text-zinc-600">
        My Bugs <span>(3)</span>
      </h1>
      <div className="mt-3">
        <Link className="font-normal hover:font-medium leading-none text-[1.02rem] flex items-center gap-2  p-3 rounded-lg transition-transform duration-300 transform-gpu hover:scale-[1.01] hover:bg-zinc-300">
          <span>This is the first bug</span>
        </Link>
        <Link className="font-normal hover:font-medium leading-none text-[1.02rem] flex items-center gap-2  p-3 rounded-lg transition-transform duration-300 transform-gpu hover:scale-[1.01] hover:bg-zinc-300">
          <span>This is the second bug</span>
        </Link>
        <Link className="font-normal hover:font-medium leading-none text-[1.02rem] flex items-center gap-2  p-3 rounded-lg transition-transform duration-300 transform-gpu hover:scale-[1.01] hover:bg-zinc-300">
          <span>This is the third bug</span>
        </Link>
      </div>
      <Link className="mt-auto text-zinc-500">
        <i class="ri-question-line mr-1"></i>
        <span>Help & Support</span>
      </Link>
    </div>
  );
}
