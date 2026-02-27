import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import api from "../utils/axios.jsx";

import { useState, useContext } from "react";
import LeftPanel from "./Leftpanel";
import { bugContext } from "../utils/Mycontext.jsx";
import { userContext } from "../utils/UserContext.jsx";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [rememberMe, setRememberme] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getBugs } = useContext(bugContext);
  const { getUser } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // assuming backend returns { token: "..." }
      const { token } = res.data;

      // save token
      if (rememberMe) {
        localStorage.setItem("token", token); // stays after browser close
      } else {
        sessionStorage.setItem("token", token); // gone after tab close
      }

      await Promise.all([getBugs(), getUser()]);
      // go to home/dashboard
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
            Welcome Back!
          </h1>
          <h4 className="text-zinc-600 font-semibold text-[0.88rem]">
            Enter your credencials to jump back in.
          </h4>
        </div>
        <div className="w-[45%]">
          <form onSubmit={handleSubmit} className="flex flex-col  w-full mt-9">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="example@mail.com"
              className="w-[100%] border-[2px] border-zinc-300 rounded-md px-3 py-2 font-semibold text-[.89rem] tracking-wider outline-none flex items-center mb-5"
            />
            <label htmlFor="" className="font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                // We keep it as "text" but use CSS to mask it like a password
                type="text"
                name="password"
                onChange={(e) => setpassword(e.target.value)}
                value={password}
                placeholder="********"
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
            <div className="flex justify-between mt-3">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={(e) => setRememberme(e.target.checked)}
                  value={rememberMe}
                  className="border-zinc-300"
                  name="remember me"
                />
                <label className="font-normal  text-zinc-500">
                  Remember Me
                </label>
              </div>
              <Link className="font-medium hover:text-zinc-800">
                Forgot Password?
              </Link>
            </div>
            {/* <input
              type="submit"
              value="Log In"
              className="border-none bg-violet-600 hover:bg-violet-500 duration-300 cursor-pointer px-3 py-2 rounded-md font-medium text-white mt-7"
            /> */}

            <button
              type="submit"
              className="border-none bg-violet-600 hover:bg-violet-500 duration-300 cursor-pointer px-3 py-2 rounded-md font-medium text-white mt-7"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </form>
          <div className="mt-7 flex gap-4 w-full items-center">
            <hr className="w-[30%] text-zinc-100" />
            <span className="text-zinc-400">Or log in with</span>
            <hr className="w-[30%] text-zinc-100" />
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
              Don't have an account?
            </span>
            <Link
              to="/signup"
              className="text-zinc-900 font-semibold hover:text-zinc-700 underline underline-offset-2"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
