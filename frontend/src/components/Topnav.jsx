import { useRef, useState } from "react";
import { gsap } from "gsap";
import { FiSearch } from "react-icons/fi";
import SearchBox from "./SearchBox";

export default function Topnav({ removetoken, username, email }) {
  const inputWrapRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const toggleSearch = () => {
    if (!open) {
      // open animation
      gsap.set(inputWrapRef.current, { display: "block" });
      gsap.fromTo(
        inputWrapRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.35,
          ease: "power3.out",
          transformOrigin: "right center",
          onComplete: () => inputRef.current.focus(),
        },
      );
    } else {
      // animate close (left -> right) then hide
      gsap.to(inputWrapRef.current, {
        scaleX: 0,
        duration: 0.25,
        ease: "power3.in",
        transformOrigin: "right center",
        onComplete: () => {
          gsap.set(inputWrapRef.current, { display: "none" });
        },
      });
    }

    setOpen(!open);
  };
  return (
    <div className="w-full h-[55px] px-6 py-7 border-b-1 border-zinc-300 relative">
      <SearchBox />
      <div className="absolute top-[23%] right-22 group cursor-pointer">
        <i className="ri-settings-3-line text-2xl"></i>

        <div
          role="tooltip"
          className="pointer-events-none absolute top-[125%] left-[75%] z-[99999] -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 tooltip"
        >
          Settings
        </div>
      </div>

      {/* Profile */}
      <div className="absolute top-[20%] right-10 group cursor-pointer">
        <i
          onClick={() => setProfileOpen((prev) => !prev)}
          className="ri-account-circle-fill text-3xl"
        ></i>

        {!profileOpen && (
          <div
            role="tooltip"
            className="pointer-events-none absolute top-[125%] left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 tooltip"
          >
            Profile
          </div>
        )}

        {profileOpen && (
          <div className="absolute top-[145%] right-0 mt-2 w-56 rounded-lg  border border-zinc-300 bg-white shadow-lg p-4 z-[100]">
            <img src="" alt="" />
            <div className="mb-3">
              <p className="text-sm text-center font-semibold text-zinc-800">
                {username}
              </p>
              <p className="text-xs text-center text-zinc-500">{email}</p>
            </div>

            <hr className="my-2 text-zinc-300" />

            <button
              className="w-full text-center px-3 py-2 rounded-md text-sm cursor-pointer text-red-600 border border-red-200 hover:bg-red-50"
              onClick={removetoken}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
