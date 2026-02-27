import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Leftnav from "./Leftnav";
import Topnav from "./Topnav";
import api from "../utils/axios.jsx";
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

function statusTone(status) {
  if (status === "open") return "bg-red-50 text-red-700 border-red-200";
  if (status === "in-progress")
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (status === "fixed") return "bg-green-50 text-green-700 border-green-200";
  return "bg-zinc-100 text-zinc-600 border-zinc-200";
}

function StatCard({ title, value, tone }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${tone}`}>
      <p className="text-sm mb-1">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function RecentBugRow({ bug }) {
  return (
    <Link
      to={`/${bug.bugId}/bugdetails`}
      className="flex items-center justify-between border border-zinc-200 rounded-lg p-3 hover:bg-zinc-50 transition"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{bug.title}</p>
        <p className="text-xs text-zinc-500">Updated {timeAgo(bug.updatedAt)}</p>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded-md border ${statusTone(bug.status)}`}
      >
        {bug.archived ? "archived" : bug.status}
      </span>
    </Link>
  );
}

function BreakdownRow({ label, value, total, colorClass }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600">{label}</span>
        <span className="font-medium text-zinc-900">
          {value} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { setBugs } = useContext(bugContext);
  const { user, getUser, clearUser } = useContext(userContext);

  const [dashboardBugs, setDashboardBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    clearUser();
    setBugs([]);
    window.location.href = "/signin";
  }

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      const hasToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!hasToken) {
        removeToken();
        return;
      }

      const [bugsRes] = await Promise.all([
        api.get("/bugs", { params: { limit: 200 } }),
        user.username ? Promise.resolve() : getUser(),
      ]);

      const bugs = bugsRes.data?.data || [];
      setDashboardBugs(bugs);
      setBugs(bugs);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const total = dashboardBugs.length;
    const open = dashboardBugs.filter((bug) => bug.status === "open").length;
    const inProgress = dashboardBugs.filter(
      (bug) => bug.status === "in-progress",
    ).length;
    const fixed = dashboardBugs.filter((bug) => bug.status === "fixed").length;
    const archived = dashboardBugs.filter((bug) => bug.archived).length;

    return { total, open, inProgress, fixed, archived };
  }, [dashboardBugs]);

  const recentBugs = useMemo(() => {
    return [...dashboardBugs]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 7);
  }, [dashboardBugs]);

  const recentActivity = useMemo(() => {
    return recentBugs.slice(0, 5).map((bug) => {
      let action = "Updated";
      if (bug.archived) action = "Archived";
      else if (bug.status === "fixed") action = "Fixed";
      else if (bug.status === "in-progress") action = "Moved in-progress";

      return `${action}: ${bug.title} (${timeAgo(bug.updatedAt)})`;
    });
  }, [recentBugs]);

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
            <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Overview of your bugs</p>
          </div>

          {loading && (
            <div className="bg-white border border-zinc-200 rounded-xl p-6 text-zinc-500">
              Loading dashboard...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchDashboardData}
                className="px-3 py-1.5 text-sm rounded-lg border border-red-300 hover:bg-red-100"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                  title="Total Bugs"
                  value={stats.total}
                  tone="border-zinc-200 text-zinc-900"
                />
                <StatCard
                  title="Open"
                  value={stats.open}
                  tone="border-red-200 text-red-700"
                />
                <StatCard
                  title="In Progress"
                  value={stats.inProgress}
                  tone="border-yellow-200 text-yellow-700"
                />
                <StatCard
                  title="Fixed"
                  value={stats.fixed}
                  tone="border-green-200 text-green-700"
                />
                <StatCard
                  title="Archived"
                  value={stats.archived}
                  tone="border-zinc-300 text-zinc-700"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      Recent Bugs
                    </h3>
                    <Link
                      to="/"
                      className="text-xs font-medium text-violet-700 hover:text-violet-800"
                    >
                      View all
                    </Link>
                  </div>

                  {recentBugs.length ? (
                    <div className="space-y-4">
                      {recentBugs.map((bug) => (
                        <RecentBugRow key={bug._id || bug.bugId} bug={bug} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No bugs yet.</p>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-zinc-200 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                      Status Breakdown
                    </h3>
                    <div className="space-y-4">
                      <BreakdownRow
                        label="Open"
                        value={stats.open}
                        total={stats.total}
                        colorClass="bg-red-500"
                      />
                      <BreakdownRow
                        label="In Progress"
                        value={stats.inProgress}
                        total={stats.total}
                        colorClass="bg-yellow-500"
                      />
                      <BreakdownRow
                        label="Fixed"
                        value={stats.fixed}
                        total={stats.total}
                        colorClass="bg-green-500"
                      />
                      <BreakdownRow
                        label="Archived"
                        value={stats.archived}
                        total={stats.total}
                        colorClass="bg-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                      Recent Activity
                    </h3>
                    {recentActivity.length ? (
                      <ul className="space-y-3 text-sm text-zinc-700">
                        {recentActivity.map((activity, index) => (
                          <li key={index}>- {activity}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No recent activity yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
