import Leftnav from "./Leftnav";
import Topnav from "./Topnav";

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <p className="text-sm text-zinc-500 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function RecentBugRow({ title, status, updated }) {
  return (
    <div className="flex items-center justify-between border border-zinc-200 rounded-lg p-3 hover:bg-zinc-50 transition">
      <div>
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        <p className="text-xs text-zinc-500">Updated {updated}</p>
      </div>

      <span className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600">
        {status}
      </span>
    </div>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-600">{label}</span>
      <span className="font-medium text-zinc-900">{value}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="w-screen h-screen flex">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav />
        <div className="w-full h-full px-6 py-6 bg-zinc-50">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Overview of your bugs</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Bugs" value="128" />
            <StatCard title="Open" value="42" />
            <StatCard title="In Progress" value="31" />
            <StatCard title="Archived" value="55" />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bugs */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                Recent Bugs
              </h3>

              <div className="space-y-4">
                <RecentBugRow
                  title="Login button unresponsive on Safari iOS 17.2"
                  status="Open"
                  updated="3 days ago"
                />
                <RecentBugRow
                  title="Profile picture not updating for mobile users"
                  status="In Progress"
                  updated="5 days ago"
                />
                <RecentBugRow
                  title="Slow loading time on reports dashboard"
                  status="Archived"
                  updated="1 week ago"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              {/* Status Breakdown */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                  Status Breakdown
                </h3>

                <div className="space-y-3 text-sm">
                  <BreakdownRow label="Open" value="42" />
                  <BreakdownRow label="In Progress" value="31" />
                  <BreakdownRow label="Resolved" value="20" />
                  <BreakdownRow label="Archived" value="55" />
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                  Recent Activity
                </h3>

                <ul className="space-y-3 text-sm text-zinc-700">
                  <li>• @mariam closed a bug</li>
                  <li>• @alex archived an issue</li>
                  <li>• @you created a new bug</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
