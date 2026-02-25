import { useRef, useState } from "react";
import { gsap } from "gsap";

export default function SearchBox() {
  const inputWrapRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const toggleSearch = () => {
    if (!open) {
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
    <div className="absolute group top-[20%] right-32 w-64 h-9 border-r-1 px-2 border-zinc-300 flex items-center justify-end gap-2">
      {/* This is the ONLY thing that animates */}
      <div
        ref={inputWrapRef}
        style={{ display: "none" }}
        className="origin-right"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="h-10 px-4  border border-zinc-300 rounded-full outline-none"
        />
      </div>

      {/* Button always visible */}
      <button
        onClick={toggleSearch}
        className="p-2 rounded-full  cursor-pointer"
      >
        {open ? (
          <span className="text-2xl leading-none">
            <i className="ri-close-fill"></i>
          </span>
        ) : (
          <span className="text-2xl leading-none">
            <i className="ri-search-line"></i>
          </span>
        )}
      </button>

      <div className="pointer-events-none absolute top-[115%] left-[90%]  z-[99999] -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {open ? "Close" : "Click to Search"}
      </div>
    </div>
  );
}
