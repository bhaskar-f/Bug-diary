import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import { bugContext } from "../utils/Mycontext.jsx";
import { userContext } from "../utils/UserContext.jsx";

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

function BugCard({ bug }) {
  return (
    <Link
      to={`/${bug.bugId}/bugdetails`}
      className="bug w-90 h-75 bg-zinc-100 rounded-lg flex flex-col items-center p-2 shadow-[0_0_12px_0.12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_3px_rgba(0,0,0,0.1)]"
    >
      <div className="w-[100%] h-[65%] bg-zinc-200 rounded-lg relative overflow-hidden shadow-sm">
        {bug.pinned && (
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

export default function BugPages() {
  const { bugs, setBugs, getBugs } = useContext(bugContext);
  const { user, getUser, clearUser } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [pinFilter, setPinFilter] = useState("all");
  const [archivedFilter, setArchivedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated-desc");

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

  const allBugPages = useMemo(() => {
    return [...bugs].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
  }, [bugs]);

  const areaOptions = useMemo(() => {
    const uniqueAreas = Array.from(
      new Set(
        bugs
          .map((bug) => (bug.area || "").trim())
          .filter(Boolean),
      ),
    );
    return uniqueAreas.sort((a, b) => a.localeCompare(b));
  }, [bugs]);

  const filteredBugPages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const list = [...allBugPages].filter((bug) => {
      const matchesSearch =
        !query ||
        bug.title?.toLowerCase().includes(query) ||
        bug.description?.toLowerCase().includes(query) ||
        bug.area?.toLowerCase().includes(query) ||
        (bug.tags || []).join(" ").toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || bug.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || bug.priority === priorityFilter;
      const matchesArea = areaFilter === "all" || bug.area === areaFilter;

      const matchesPin =
        pinFilter === "all" ||
        (pinFilter === "pinned" ? bug.pinned : !bug.pinned);

      const matchesArchived =
        archivedFilter === "all" ||
        (archivedFilter === "archived" ? bug.archived : !bug.archived);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesArea &&
        matchesPin &&
        matchesArchived
      );
    });

    list.sort((a, b) => {
      if (sortBy === "updated-desc") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      if (sortBy === "updated-asc") {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      }
      if (sortBy === "created-desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "created-asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "title-asc") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }
      if (sortBy === "title-desc") {
        return String(b.title || "").localeCompare(String(a.title || ""));
      }
      return 0;
    });

    return list;
  }, [
    allBugPages,
    searchTerm,
    statusFilter,
    priorityFilter,
    areaFilter,
    pinFilter,
    archivedFilter,
    sortBy,
  ]);

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAreaFilter("all");
    setPinFilter("all");
    setArchivedFilter("all");
    setSortBy("updated-desc");
  }

  return (
    <div className="w-screen h-screen flex">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />

        <div className="w-full h-full overflow-y-auto px-8 py-7">
          <div className="flex items-center gap-1.5">
            <Link
              to="/"
              className="text-sm transition-colors hover:text-violet-600 text-zinc-400"
            >
              Home
            </Link>
            <span className="text-sm text-zinc-400">/</span>
            <span className="text-sm font-medium text-zinc-300">
              All Bug Pages
            </span>
          </div>

          <div className="mt-6 mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">All Bug Pages</h1>
            <span className="text-sm text-zinc-500">
              Showing {filteredBugPages.length} of {allBugPages.length}
            </span>
          </div>

          <div className="mb-5 p-4 rounded-lg border border-zinc-200 bg-white flex flex-wrap gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, description, area, tag..."
              className="min-w-[250px] flex-1 px-3 py-2 text-sm rounded-md border border-zinc-300 outline-none focus:border-violet-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 bg-white outline-none focus:border-violet-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="fixed">Fixed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 bg-white outline-none focus:border-violet-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="mid">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 bg-white outline-none focus:border-violet-500"
            >
              <option value="all">All Areas</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <select
              value={pinFilter}
              onChange={(e) => setPinFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 bg-white outline-none focus:border-violet-500"
            >
              <option value="all">Pinned + Unpinned</option>
              <option value="pinned">Only Pinned</option>
              <option value="unpinned">Only Unpinned</option>
            </select>

            <select
              value={archivedFilter}
              onChange={(e) => setArchivedFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 bg-white outline-none focus:border-violet-500"
            >
              <option value="all">Archived + Active</option>
              <option value="active">Only Active</option>
              <option value="archived">Only Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 bg-white outline-none focus:border-violet-500"
            >
              <option value="updated-desc">Updated: Newest</option>
              <option value="updated-asc">Updated: Oldest</option>
              <option value="created-desc">Created: Newest</option>
              <option value="created-asc">Created: Oldest</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="title-desc">Title: Z-A</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm rounded-md border border-zinc-300 hover:bg-zinc-100 text-zinc-700"
            >
              Clear Filters
            </button>
          </div>

          <div className="bugs min-h-48 w-[100%] mb-10 p-[12px] flex flex-wrap gap-[13px] rounded-lg shadow-[0_0_12px_0.1px_rgba(0,0,0,0.1)]">
            {loading && <div className="text-zinc-500">Loading bug pages...</div>}
            {!loading && filteredBugPages.length === 0 && (
              <div className="text-zinc-500">No bug pages found.</div>
            )}
            {!loading &&
              filteredBugPages.map((bug) => (
                <BugCard key={bug._id || bug.bugId} bug={bug} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
