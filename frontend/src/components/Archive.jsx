import { useContext, useEffect, useMemo, useState } from "react";
import Leftnav from "./Leftnav.jsx";
import Topnav from "./Topnav.jsx";
import ArchivedCard from "./ArchivedCard.jsx";
import api from "../utils/axios.jsx";
import { bugContext } from "../utils/Mycontext.jsx";
import { userContext } from "../utils/UserContext.jsx";

const DATE_FILTERS = [
  { value: "all", label: "Any Date" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

function matchesDateFilter(dateString, dateFilter) {
  if (dateFilter === "all") return true;
  if (!dateString) return false;

  const now = Date.now();
  const updatedTime = new Date(dateString).getTime();
  if (Number.isNaN(updatedTime)) return false;

  const diffMs = now - updatedTime;
  const dayMs = 24 * 60 * 60 * 1000;

  if (dateFilter === "24h") return diffMs <= dayMs;
  if (dateFilter === "7d") return diffMs <= 7 * dayMs;
  if (dateFilter === "30d") return diffMs <= 30 * dayMs;
  return true;
}

export default function Archive() {
  const { getBugs, setBugs } = useContext(bugContext);
  const { user, getUser, clearUser } = useContext(userContext);

  const [archivedBugs, setArchivedBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyBugId, setBusyBugId] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [search, setSearch] = useState("");

  const areaOptions = useMemo(() => {
    const areas = archivedBugs
      .map((bug) => bug.area || "")
      .map((area) => area.trim())
      .filter(Boolean);

    return Array.from(new Set(areas)).sort((a, b) => a.localeCompare(b));
  }, [archivedBugs]);

  const filteredArchivedBugs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return archivedBugs.filter((bug) => {
      const matchesStatus = statusFilter === "all" || bug.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || bug.priority === priorityFilter;
      const matchesArea = areaFilter === "all" || bug.area === areaFilter;
      const matchesDate = matchesDateFilter(bug.updatedAt, dateFilter);

      const tagsText = (bug.tags || []).join(" ").toLowerCase();
      const matchesSearch =
        !term ||
        bug.title?.toLowerCase().includes(term) ||
        bug.description?.toLowerCase().includes(term) ||
        bug.area?.toLowerCase().includes(term) ||
        tagsText.includes(term);

      return (
        matchesStatus &&
        matchesPriority &&
        matchesArea &&
        matchesDate &&
        matchesSearch
      );
    });
  }, [archivedBugs, dateFilter, areaFilter, priorityFilter, search, statusFilter]);

  function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    setBugs([]);
    window.location.href = "/signin";
  }

  async function fetchArchivedBugs() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bugs", {
        params: { archived: "true", limit: 200 },
      });
      const onlyArchived = (response.data?.data || [])
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setArchivedBugs(onlyArchived);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch archived bugs",
      );
    } finally {
      setLoading(false);
    }
  }

  async function restoreBug(bug) {
    try {
      setBusyBugId(bug._id);
      await api.patch(`/bugs/${bug._id}/archive`);
      setArchivedBugs((prev) => prev.filter((item) => item._id !== bug._id));
      await getBugs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to restore bug",
      );
    } finally {
      setBusyBugId("");
    }
  }

  async function deleteBug(bug) {
    const shouldDelete = window.confirm(
      `Delete "${bug.title}" permanently? This cannot be undone.`,
    );
    if (!shouldDelete) return;

    try {
      setBusyBugId(bug._id);
      await api.delete(`/bugs/${bug._id}`);
      setArchivedBugs((prev) => prev.filter((item) => item._id !== bug._id));
      await getBugs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete bug",
      );
    } finally {
      setBusyBugId("");
    }
  }

  useEffect(() => {
    const hasToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!hasToken) {
      removeToken();
      return;
    }

    if (!user.username) getUser();
    fetchArchivedBugs();
  }, []);

  return (
    <div className="w-screen h-screen flex">
      <Leftnav />

      <div className="w-[80%] h-full flex flex-col">
        <Topnav
          removetoken={removeToken}
          username={user.username}
          email={user.email}
        />

        <div className="w-full h-full px-6 py-6 bg-zinc-50 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-zinc-900">Archive</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Archived bugs and closed issues ({archivedBugs.length})
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "open", label: "Open" },
                { value: "in-progress", label: "In Progress" },
                { value: "fixed", label: "Fixed" },
              ]}
            />
            <FilterSelect
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: "all", label: "All Priorities" },
                { value: "low", label: "Low" },
                { value: "mid", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]}
            />
            <FilterSelect
              value={areaFilter}
              onChange={setAreaFilter}
              options={[
                { value: "all", label: "All Areas" },
                ...areaOptions.map((area) => ({ value: area, label: area })),
              ]}
            />
            <FilterSelect
              value={dateFilter}
              onChange={setDateFilter}
              options={DATE_FILTERS}
            />
            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 w-72">
              <span className="text-zinc-400">Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-sm text-zinc-700 placeholder:text-zinc-400"
                placeholder="Search archived bugs..."
              />
            </div>
          </div>

          {loading && (
            <div className="text-zinc-500 bg-white border border-zinc-200 rounded-xl p-5">
              Loading archived bugs...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchArchivedBugs}
                className="px-3 py-1.5 text-sm rounded-lg border border-red-300 hover:bg-red-100"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredArchivedBugs.length === 0 && (
            <div className="bg-white border border-zinc-200 rounded-xl p-6 text-zinc-500">
              No archived bugs found for the current filters.
            </div>
          )}

          {!loading && !error && filteredArchivedBugs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArchivedBugs.map((bug) => (
                <ArchivedCard
                  key={bug._id}
                  bug={bug}
                  busy={busyBugId === bug._id}
                  onRestore={() => restoreBug(bug)}
                  onDelete={() => deleteBug(bug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-zinc-200 rounded-lg px-4 py-2 min-w-[180px] text-sm text-zinc-700 outline-none focus:border-violet-400"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
