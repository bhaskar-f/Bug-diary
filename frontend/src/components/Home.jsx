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
      className="bug w-full min-h-[16.5rem] bg-zinc-100 rounded-lg flex flex-col items-center p-1.5 shadow-[0_0_12px_0.12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_3px_rgba(0,0,0,0.1)]"
    >
      <div className="w-full h-36 sm:h-40 bg-zinc-200 rounded-lg relative overflow-hidden shadow-sm">
        {showPin && (
          <span className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-md bg-white/80 text-zinc-700 text-[10px] font-medium border border-zinc-200">
            Pinned
          </span>
        )}

        <img
          src={
            bug.screenshots?.[0] ||
            "https://images.unsplash.com/photo-1756822084498-e76c94f0f700?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29mdHdhcmUlMjBidWd8ZW58MHx8MHx8fDA%3D"
          }
          alt="Bug cover"
          className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-110 cursor-pointer"
        />
        <span
          className={`absolute top-0 left-1/2 font-medium -translate-x-[50%] min-w-auto h-6 ${
            bug.status === "fixed"
              ? "bg-emerald-500/60 text-green-950"
              : bug.status === "open"
                ? "bg-red-500/60 text-red-950"
                : bug.status === "in-progress"
                  ? "bg-yellow-500/60 text-yellow-950"
                  : "bg-zinc-500/60 text-zinc-950"
          } rounded-b-md px-1.5 text-[11px]`}
        >
          {bug.status}
        </span>
      </div>

      <h1 className="text-[1.03rem] font-semibold text-zinc-800 hover:text-black cursor-pointer mt-1.5 leading-[1.1] line-clamp-2">
        {bug.title}
      </h1>

      <div className="w-full flex justify-between gap-2 mt-1.5">
        <span className="text-[11px] sm:text-xs">
          Last updated {timeAgo(bug.updatedAt)}
        </span>
        <div className="area text-[11px] sm:text-xs shrink-0">
          {bug.area || "General"}
        </div>
      </div>

      <div className="tags text-[11px] w-full flex flex-wrap gap-1 mt-1.5">
        {(bug.tags || []).slice(0, 4).map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="inline-flex px-1.5 py-[1px] border border-zinc-500 rounded-2xl items-center"
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
    <div className="min-h-screen w-full bg-zinc-50 lg:h-screen lg:flex lg:overflow-hidden">
      <Leftnav
        removetoken={removeToken}
        username={user.username}
        email={user.email}
      />
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />

        <div className="flex-1 min-h-0 w-full overflow-y-auto">
          <div className="px-3.5 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="flex flex-col items-center justify-center p-5 sm:p-6 max-h-[360px]">
                <h1 className="text-[1.2rem] sm:text-[1.45rem] font-semibold leading-tight text-center">
                  Hi {user.username || "Boss"}! Welcome Back 👋
                </h1>
                <div className="w-full sm:w-2/3 md:w-1/2 mt-6">
                  <Link
                    to="/create"
                    className="font-medium text-[0.95rem] flex items-center justify-center bg-violet-600 text-white border border-violet-600 gap-1.5 hover:bg-white hover:text-violet-700 hover:border-violet-600 py-2.5 px-2.5 rounded-lg duration-300"
                  >
                    <i className="ri-add-large-line font-bold"></i>
                    Create a Bug Page
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border-2 border-zinc-200 bg-white max-h-[300px] p-3.5 overflow-y-auto">
                <div className="flex items-center justify-between mb-2.5">
                  <h2 className="text-lg font-semibold">Pinned Bugs</h2>
                  <span className="text-xs text-zinc-500">
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
                        className="block text-xs rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 hover:bg-zinc-100"
                      >
                        <div className="font-medium text-zinc-800 text-[0.82rem] truncate">
                          {bug.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          Updated {timeAgo(bug.updatedAt)}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            unpin(bug._id);
                          }}
                          className="mt-1.5 text-zinc-500 hover:text-zinc-800 cursor-pointer"
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

            <div className="mt-6 rounded-lg border-2 border-zinc-200 bg-white">
              <div className="px-3.5 py-3.5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold leading-none">
                  Recent Bugs
                </h2>
                <Link
                  to="/bug-pages"
                  className="text-xs px-2.5 py-1.5 rounded-md border border-zinc-300 hover:bg-zinc-100 text-zinc-700"
                >
                  View all
                </Link>
              </div>

              <div className="p-3.5">
                {loading && (
                  <div className="text-zinc-500">Loading recent bugs...</div>
                )}
                {!loading && recentBugs.length === 0 && (
                  <div className="text-zinc-500">
                    No bug pages yet. Create your first bug page.
                  </div>
                )}
                {!loading && recentBugs.length > 0 && (
                  <div className="bugs min-h-40 w-full mb-2 p-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
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
