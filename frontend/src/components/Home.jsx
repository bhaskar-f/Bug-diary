import { useEffect, useState } from "react";
import api from "../utils/axios";
import { Link } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { FiPlusCircle } from "react-icons/fi";

export default function Home() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");

  function removetoken() {
    localStorage.removeItem("token");
    setUser("");
    window.location.href = "/signin"; // or navigate()
  }

  useEffect(() => {
    api
      .get("/bugs")
      .then(function (response) {
        // handle success
        console.log(response.data);
        setUser(response.data.username);
        setEmail(response.data.email);
        console.log(user);

        // Access the data via response.data
      })
      .catch(function (error) {
        // handle error
        console.error(error);
      })
      .finally(function () {
        // always executed
        console.log("Request finished");
      });
  }, [user]);

  return (
    <div className="w-screen h-screen flex items-center">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav removetoken={removetoken} username={user} email={email} />
        <div className="w-full h-full">
          <div className="px-8 py-7">
            <span className="text-2xl font-semibold mb-10">
              Hi {user}! Welcome Back 👋{" "}
            </span>
            <div className="w-[25%] mt-10">
              <Link
                to="/create"
                className="font-medium text-[1.03rem] flex items-center justify-center bg-violet-600 text-white border border-violet-600 gap-2 hover:bg-white hover:text-violet-700 hover:border-violet-600 py-3 px-3 rounded-lg mb-6 duration-300"
              >
                <i class="ri-add-large-line font-bold"></i>
                Create a Bug Page
              </Link>
            </div>
            <div>
              <div className="mt-9 mb-4">
                <h1 className="text-xl font-semibold">Pages </h1>
              </div>
              <div className="bugs h-100 w-[100%]  p-[12px] flex flex-wrap gap-[13px] overflow-y-auto rounded-lg shadow-[0_0_12px_0.1px_rgba(0,0,0,0.1)]">
                <Link
                  to="/bugdetails"
                  className="bug w-90 h-75 bg-zinc-100 rounded-lg flex flex-col items-center p-2 shadow-[0_0_12px_0.12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_3px_rgba(0,0,0,0.1)]"
                >
                  <div className="w-[100%] h-[65%] bg-red-300 rounded-lg relative overflow-hidden shadow-sm ">
                    <img
                      src="https://images.unsplash.com/photo-1761839256951-10c4468c3621?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
                      alt="Bug Image"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
                    />
                    <span className="absolute top-0 left-1/2 -translate-x-[50%] min-w-auto h-7 bg-red-400 rounded-b-md px-2">
                      status
                    </span>
                  </div>
                  <h1 className="text-[1.14rem] font-semibold text-zinc-800 hover:text-black cursor-pointer mt-2 leading-[1.1]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi eveniet
                  </h1>
                  <div className="w-full flex justify-between mt-2">
                    <span className="text-sm">last updated</span>
                    <div className="area text-sm">area</div>
                  </div>
                  <div className="tags text-xs w-full flex flex-wrap gap-1 mt-2">
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                  </div>
                </Link>
                <div className="bug w-90 h-75 bg-zinc-100 rounded-lg flex flex-col items-center p-2 shadow-[0_0_12px_0.12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_3px_rgba(0,0,0,0.1)]">
                  <div className="w-[100%] h-[65%] bg-red-300 rounded-lg relative overflow-hidden shadow-sm ">
                    <img
                      src="https://images.unsplash.com/photo-1761839256951-10c4468c3621?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
                      alt="Bug Image"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
                    />
                    <span className="absolute top-0 left-1/2 -translate-x-[50%] min-w-auto h-7 bg-red-400 rounded-b-md px-2">
                      status
                    </span>
                  </div>
                  <h1 className="text-[1.14rem] font-semibold text-zinc-800 hover:text-black cursor-pointer mt-2 leading-[1.1]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nisi eveniet
                  </h1>
                  <div className="w-full flex justify-between mt-2">
                    <span className="text-sm">last updated</span>
                    <div className="area text-sm">area</div>
                  </div>
                  <div className="tags text-xs w-full flex flex-wrap gap-1 mt-2">
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                    <span className="inline-flex px-2 py-[1px] border border-1 border-zinc-500 rounded-2xl items-center ">
                      tag1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <br />
      <button
        onClick={removetoken}
        className="border-none bg-violet-600 hover:bg-violet-500 duration-300 cursor-pointer px-3 py-2 rounded-md font-medium text-white mt-7"
      >
        Log out
      </button> */}
    </div>
  );
}
