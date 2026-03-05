import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import NavActions from "./NavActions";
import { bugContext } from "../utils/Mycontext.jsx";

const MOBILE_NAV_ITEMS = [
  { to: "/", label: "Home", icon: "ri-home-4-line", end: true },
  { to: "/archive", label: "Archive", icon: "ri-inbox-archive-line" },
  { to: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
  { to: "/drafts", label: "Drafts", icon: "ri-file-list-3-line" },
];

export default function Topnav({ removetoken, username, email }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { bugs } = useContext(bugContext);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="w-full border-b border-zinc-300 bg-white px-3.5 py-2 md:hidden lg:block lg:px-5">
        <div className="relative flex items-center justify-between gap-2 lg:justify-end lg:gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="h-8 w-8 rounded-full border border-zinc-300 text-zinc-700 flex items-center justify-center lg:hidden"
            aria-label="Open navigation menu"
          >
            <i className="ri-menu-line text-lg"></i>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 lg:hidden pointer-events-none">
            <img src="/logo.png" alt="logo" className="w-5" />
            <span className="text-sm font-semibold text-zinc-800">Bug Diary</span>
          </div>

          <NavActions
            removetoken={removetoken}
            username={username}
            email={email}
            className="ml-auto"
          />
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[140] bg-black/35 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="fixed top-0 left-0 z-[150] h-screen w-[17rem] max-w-[84vw] border-r border-zinc-300 bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="w-5" />
                <span className="text-sm font-semibold text-zinc-800">
                  Bug Diary
                </span>
              </div>
              <button
                type="button"
                className="h-8 w-8 rounded-full hover:bg-zinc-100 text-zinc-600"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="px-3 py-3.5">
              <p className="text-xs text-zinc-500 mb-2">{bugs.length} bugs</p>
              <nav className="space-y-1.5">
                {MOBILE_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-zinc-200 text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`
                    }
                  >
                    <i className={`${item.icon} text-base`}></i>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
