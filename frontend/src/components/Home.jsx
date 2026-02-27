import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { bugContext } from "../utils/Mycontext.jsx";
import { userContext } from "../utils/UserContext.jsx";
import { RiUnpinLine } from "react-icons/ri";
import api from "../utils/axios.jsx";

function timeAgo(dateString) {
  if (!dateString) return "unknown";

  const now = new Date();
  const updated = new Date(dateString);
  const diffMs = now - updated;
  if (Number.isNaN(diffMs) || diffMs < 0) return "unknown";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
}

function BugCard({ bug, showPin }) {
  return (
    <Link
      to={`/${bug.bugId}/bugdetails`}
      className="bug w-90 h-75 bg-zinc-100 rounded-lg flex flex-col items-center p-2 shadow-[0_0_12px_0.12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_3px_rgba(0,0,0,0.1)]"
    >
      <div className="w-[100%] h-[65%] bg-zinc-200 rounded-lg relative overflow-hidden shadow-sm">
        {showPin && (
          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-white/80 text-zinc-700 text-xs font-medium border border-zinc-200">
            Pinned
          </span>
        )}

        <img
          src={
            bug.screenshots?.[0] ||
            "https://images.unsplash.com/photo-1761839256951-10c4468c3621?w=500&auto=format&fit=crop&q=60"
          }
          alt="Bug cover"
          className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
        />
        <span
          className={`absolute top-0 left-1/2 font-medium -translate-x-[50%] min-w-auto h-7 ${
            bug.status === "fixed"
              ? "bg-emerald-500/60 text-green-950"
              : bug.status === "open"
                ? "bg-red-500/60 text-red-950"
                : bug.status === "in-progress"
                  ? "bg-yellow-500/60 text-yellow-950"
                  : "bg-zinc-500/60 text-zinc-950"
          } rounded-b-md px-2`}
        >
          {bug.status}
        </span>
      </div>

      <h1 className="text-[1.14rem] font-semibold text-zinc-800 hover:text-black cursor-pointer mt-2 leading-[1.1] line-clamp-2">
        {bug.title}
      </h1>

      <div className="w-full flex justify-between mt-2">
        <span className="text-sm">Last updated {timeAgo(bug.updatedAt)}</span>
        <div className="area text-sm">{bug.area || "General"}</div>
      </div>

      <div className="tags text-xs w-full flex flex-wrap gap-1 mt-2">
        {(bug.tags || []).slice(0, 4).map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="inline-flex px-2 py-[1px] border border-zinc-500 rounded-2xl items-center"
          >
            {"#" + tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function Home() {
  const { bugs, setBugs, getBugs } = useContext(bugContext);
  const { user, getUser, clearUser } = useContext(userContext);
  const [loading, setLoading] = useState(true);

  function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    setBugs([]);
    window.location.href = "/signin";
  }

  useEffect(() => {
    async function bootstrap() {
      const hasToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!hasToken) {
        removeToken();
        return;
      }

      try {
        await Promise.all([getBugs(), user.username ? null : getUser()]);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  const activeBugs = useMemo(() => {
    return [...bugs]
      .filter((bug) => !bug.archived)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [bugs]);

  const pinnedBugs = useMemo(() => {
    return activeBugs.filter((bug) => bug.pinned).slice(0, 5);
  }, [activeBugs]);

  async function unpin(id) {
    if (!id) return;
    try {
      await api.patch(`/bugs/${id}/pin`);
      await getBugs();
    } catch (error) {
      console.log("Error while unpinning bug:", error);
    }
  }

  const recentBugs = useMemo(() => {
    return activeBugs.slice(0, 6);
  }, [activeBugs]);

  return (
    <div className="w-screen h-screen flex items-center">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />

        <div className="w-full h-full overflow-y-auto">
          <div className="px-8 py-7">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="flex flex-col items-center justify-center  p-8 max-h-[400px]">
                <h1 className="text-[1.6rem] font-semibold leading-tight text-center">
                  Hi {user.username || "Boss"}! Welcome Back 👋
                </h1>
                <div className="w-[60%] mt-8">
                  <Link
                    to="/create"
                    className="font-medium text-[1.03rem] flex items-center justify-center bg-violet-600 text-white border border-violet-600 gap-2 hover:bg-white hover:text-violet-700 hover:border-violet-600 py-3 px-3 rounded-lg duration-300"
                  >
                    <i className="ri-add-large-line font-bold"></i>
                    Create a Bug Page
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border-2 border-zinc-200 bg-white max-h-[300px] p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Pinned Bugs</h2>
                  <span className="text-sm text-zinc-500">
                    {pinnedBugs.length}
                  </span>
                </div>

                {loading && (
                  <p className="text-zinc-500">Loading pinned bugs...</p>
                )}
                {!loading && pinnedBugs.length === 0 && (
                  <p className="text-zinc-500">No pinned bugs yet.</p>
                )}
                {!loading && pinnedBugs.length > 0 && (
                  <div className="space-y-2">
                    {pinnedBugs.map((bug) => (
                      <Link
                        key={bug._id || bug.bugId}
                        to={`/${bug.bugId}/bugdetails`}
                        className="block text-sm rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 hover:bg-zinc-100"
                      >
                        <div className="font-medium text-zinc-800 truncate">
                          {bug.title}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          Updated {timeAgo(bug.updatedAt)}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            unpin(bug._id);
                          }}
                          className="mt-2 text-zinc-500 hover:text-zinc-800 cursor-pointer"
                          title="Unpin bug"
                        >
                          <RiUnpinLine />
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-lg border-2 border-zinc-800 bg-white">
              <div className="px-4 py-4 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="text-3xl font-semibold leading-none">
                  Recent Bugs
                </h2>
                <Link
                  to="/bug-pages"
                  className="text-sm px-3 py-1.5 rounded-md border border-zinc-300 hover:bg-zinc-100 text-zinc-700"
                >
                  View all
                </Link>
              </div>

              <div className="p-4">
                {loading && (
                  <div className="text-zinc-500">Loading recent bugs...</div>
                )}
                {!loading && recentBugs.length === 0 && (
                  <div className="text-zinc-500">
                    No bug pages yet. Create your first bug page.
                  </div>
                )}
                {!loading && recentBugs.length > 0 && (
                  <div className="bugs min-h-48 w-[100%] mb-2 p-[4px] flex flex-wrap gap-[13px]">
                    {recentBugs.map((bug) => (
                      <BugCard
                        key={bug._id || bug.bugId}
                        bug={bug}
                        showPin={bug.pinned}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
