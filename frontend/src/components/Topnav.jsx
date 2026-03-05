import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SearchBox from "./SearchBox";
import api from "../utils/axios.jsx";
import { userContext } from "../utils/UserContext.jsx";
import { bugContext } from "../utils/Mycontext.jsx";

const MOBILE_NAV_ITEMS = [
  { to: "/", label: "Home", icon: "ri-home-4-line", end: true },
  { to: "/archive", label: "Archive", icon: "ri-inbox-archive-line" },
  { to: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
  { to: "/drafts", label: "Drafts", icon: "ri-file-list-3-line" },
];

function getAvatarColorFromName(name) {
  if (!name) return "hsl(220 10% 35%)";

  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 62% 42%)`;
}

export default function Topnav({ removetoken, username, email }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const profileRef = useRef(null);

  const { user, setUser } = useContext(userContext);
  const { bugs } = useContext(bugContext);
  const location = useLocation();

  const displayUsername = user?.username || username || "";
  const displayEmail = user?.email || email || "";
  const profileInitial = (displayUsername.trim().charAt(0) || "U").toUpperCase();
  const profileBgColor = getAvatarColorFromName(displayUsername);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setProfileModalOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

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

  useEffect(() => {
    if (!profileModalOpen) return;

    setFormData({
      username: displayUsername,
      email: displayEmail,
      currentPassword: "",
      password: "",
    });
    setFormError("");
    setFormSuccess("");
  }, [profileModalOpen]);

  function openProfileSettings() {
    setProfileOpen(false);
    setProfileModalOpen(true);
  }

  async function handleProfileUpdate(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const currentPassword = formData.currentPassword;
    const password = formData.password;

    if (!trimmedUsername || !trimmedEmail) {
      setFormError("Username and email are required.");
      return;
    }

    if (password && password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (password && !currentPassword) {
      setFormError("Current password is required to set a new password.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        username: trimmedUsername,
        email: trimmedEmail,
      };

      if (password) {
        payload.password = password;
        payload.currentPassword = currentPassword;
      }

      const response = await api.put("/auth/profile", payload);
      const nextUsername = response.data.username || trimmedUsername;
      const nextEmail = response.data.email || trimmedEmail;

      setUser({
        username: nextUsername,
        email: nextEmail,
      });
      setFormData((prev) => ({
        ...prev,
        username: nextUsername,
        email: nextEmail,
        currentPassword: "",
        password: "",
      }));
      setFormSuccess("Profile updated successfully.");
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleProfileDelete() {
    setFormError("");
    setFormSuccess("");

    const confirmed = window.confirm(
      "Delete your profile and all your bugs permanently?",
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await api.delete("/auth/profile");

      if (typeof removetoken === "function") {
        removetoken();
        return;
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/signin";
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Failed to delete profile.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="w-full border-b border-zinc-300 bg-white px-3.5 py-2 sm:px-5">
        <div className="relative flex items-center justify-between gap-2 sm:justify-end sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              setProfileOpen(false);
              setMobileMenuOpen(true);
            }}
            className="h-8 w-8 rounded-full border border-zinc-300 text-zinc-700 flex items-center justify-center sm:hidden"
            aria-label="Open navigation menu"
          >
            <i className="ri-menu-line text-lg"></i>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden pointer-events-none">
            <img src="/logo.png" alt="logo" className="w-5" />
            <span className="text-sm font-semibold text-zinc-800">Bug Diary</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
            <SearchBox />

            <div className="relative group" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="group cursor-pointer h-8 w-8 rounded-full text-white text-sm font-semibold flex items-center justify-center leading-none"
                style={{ backgroundColor: profileBgColor }}
              >
                {profileInitial}
              </button>

              {!profileOpen && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute top-[125%] right-0 mt-2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hidden sm:block"
                >
                  Profile
                </div>
              )}

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-zinc-300 bg-white shadow-lg p-3.5 z-[100]">
                  <div className="mb-2.5">
                    <p className="text-[0.82rem] text-center font-semibold text-zinc-800">
                      {displayUsername}
                    </p>
                    <p className="text-[0.7rem] text-center text-zinc-500">
                      {displayEmail}
                    </p>
                  </div>

                  <hr className="my-2 text-zinc-300" />

                  <button
                    type="button"
                    className="w-full text-center px-3 py-1.5 rounded-md text-[0.82rem] cursor-pointer text-zinc-700 border border-zinc-200 hover:bg-zinc-50 mb-2"
                    onClick={openProfileSettings}
                  >
                    Manage Profile
                  </button>

                  <button
                    type="button"
                    className="w-full text-center px-3 py-1.5 rounded-md text-[0.82rem] cursor-pointer text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={removetoken}
                    disabled={!removetoken}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[140] bg-black/35 sm:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="fixed top-0 left-0 z-[150] h-screen w-[17rem] max-w-[84vw] border-r border-zinc-300 bg-white shadow-xl sm:hidden">
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

      {profileModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/35 p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[1.02rem] font-semibold text-zinc-800">
                Profile Settings
              </h2>
              <button
                type="button"
                className="h-8 w-8 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                onClick={() => setProfileModalOpen(false)}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <p className="text-[0.8rem] text-zinc-500 mt-1">
              Update your account details or delete your profile.
            </p>

            <form onSubmit={handleProfileUpdate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[0.82rem] font-medium text-zinc-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Your username"
                />
              </div>

              <div>
                <label className="block text-[0.82rem] font-medium text-zinc-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="example@mail.com"
                />
              </div>

              <div>
                <label className="block text-[0.82rem] font-medium text-zinc-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Required to change password"
                />
              </div>

              <div>
                <label className="block text-[0.82rem] font-medium text-zinc-700 mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {formError && (
                <p className="text-[0.8rem] text-red-600">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-[0.8rem] text-emerald-600">{formSuccess}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-md cursor-pointer border border-zinc-300 text-zinc-700 text-sm hover:bg-zinc-100"
                  onClick={() => setProfileModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3.5 py-2 rounded-md cursor-pointer bg-violet-600 text-white text-sm hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <div className="mt-5 border-t border-zinc-200 pt-4">
              <p className="text-[0.78rem] text-zinc-500 mb-2">Danger Zone</p>
              <button
                type="button"
                onClick={handleProfileDelete}
                disabled={deleting}
                className="w-full rounded-md cursor-pointer border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
