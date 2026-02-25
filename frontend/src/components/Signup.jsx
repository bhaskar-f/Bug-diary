import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";

import { useState } from "react";
import LeftPanel from "./Leftpanel";

export default function Signup() {
  const [namefield, setNamefield] = useState("");
  const [emailfield, setEmailfield] = useState("");
  const [passwordfield, setpasswordfield] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-screen h-screen  p-5 flex justify-between gap-5">
      <div className="leftContainer w-[50%] h-full">
        <LeftPanel />
      </div>

      <div className="w-[50%] h-full shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="w-8 h-8 bg-white rounded-3xl flex items-center justify-center">
          <div
            className="w-full h-full rounded-md
 shadow-[0_6px_15px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="text-center mt-2">
          <h1 className="text-[1.3rem] font-semibold text-shadow-xs">
            Welcome to Bug Diary!
          </h1>
          <h4 className="text-zinc-600 font-semibold text-[0.88rem]">
            Enter your credencials to create an Account.
          </h4>
        </div>
        <div className="w-[45%]">
          <form action="" className="flex flex-col  w-full mt-7">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setNamefield(e.target.value)}
              value={namefield}
              placeholder="John Doe"
              className="w-[100%] border-[2px] border-zinc-300 rounded-md px-3 py-2 font-semibold text-[.89rem] tracking-wider outline-none flex items-center mb-4"
            />
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmailfield(e.target.value)}
              value={emailfield}
              placeholder="example@mail.com"
              className="w-[100%] border-[2px] border-zinc-300 rounded-md px-3 py-2 font-semibold text-[.89rem] tracking-wider outline-none flex items-center mb-4"
            />
            <label htmlFor="" className="font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                // We keep it as "text" but use CSS to mask it like a password
                type="text"
                name="password"
                onChange={(e) => setpasswordfield(e.target.value)}
                value={passwordfield}
                placeholder="Set a Password"
                className={`w-full border-[2px] border-zinc-300 rounded-md px-3 py-2 font-semibold text-[.89rem] tracking-wider outline-none transition-all duration-500 ease-in-out ${
                  showPassword ? "tracking-normal" : "password-masking"
                }`}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-4 cursor-pointer"
              >
                <div className="relative w-5 h-5">
                  <div
                    className={`absolute transition-all duration-300 transform ${showPassword ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                  >
                    <LuEyeClosed />
                  </div>
                  <div
                    className={`absolute transition-all duration-300 transform ${!showPassword ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                  >
                    <LuEye />
                  </div>
                </div>
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <Link className="text-sm text-zinc-500">
                Password Must Be min 8 characters
              </Link>
            </div>
            <input
              type="submit"
              value="Sign Up"
              className="border-none bg-violet-600 hover:bg-violet-500 duration-300 cursor-pointer px-3 py-2 rounded-md font-medium text-white mt-7"
            />
          </form>
          <div className="mt-6 flex gap-4 w-full items-center">
            <hr className="w-[27%] text-zinc-100" />
            <span className="text-zinc-400">Or continue with</span>
            <hr className="w-[27%] text-zinc-100" />
          </div>
          <div className="flex justify-between mt-4">
            <Link className="rounded-lg w-[47%] relative inline-flex group items-center justify-center px-10 py-[6px] text-lg font-semibold  cursor-pointer border-2 active:border-zinc-400 overflow-hidden active:shadow-none shadow-xs border-zinc-300">
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-zinc-300 rounded-full group-hover:w-40 group-hover:h-40 opacity-10"></span>
              <span className="relative flex items-center justify-center gap-[5px]">
                <FcGoogle className="text-xl" />
                <span className="text-[.9rem]">Google</span>
              </span>
            </Link>
            <Link className="rounded-lg w-[47%] relative inline-flex group items-center justify-center px-10 py-[6px] text-lg font-semibold  cursor-pointer border-2 active:border-zinc-400 overflow-hidden active:shadow-none shadow-xs border-zinc-300">
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-zinc-300 rounded-full group-hover:w-40 group-hover:h-40 opacity-10"></span>
              <span className="relative flex items-center justify-center gap-[5px]">
                <FaApple className="text-xl" />
                <span className="text-[.9rem]">Apple</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 mt-7">
            <span className="text-zinc-400 font-normal">
              Already have an account?
            </span>
            <Link
              to="/signin"
              className="text-zinc-900 font-semibold hover:text-zinc-700 underline underline-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
